import * as d3 from 'd3';
import { chunkHelper } from './utils/d3-chart-utils';
import { chartLocale } from './chart-config';

export class Chart {
  //Отступ
  margin = { top: 0, right: 20, bottom: 50, left: 50 };
  //Размеры холста
  width = 1200 - this.margin.left - this.margin.right;
  height = 390 - this.margin.top - this.margin.bottom;
  //Цветовая гамма
  colorScale = d3.scaleOrdinal(d3.schemeCategory10);
  //Размер оси Х
  x = d3.scaleTime().range([0, this.width]);
  //Размер оси Y
  y = d3.scaleLinear().range([this.height, 0]);
  //Форматирует время
  timeFormatter = d3.timeFormat('%d-%m-%Y');
  //Названия графиков
  regionsNamesById = {};
  //Сами графики
  regions = {};
  //ID графиков
  regionsIds;
  //ID включенных графиков
  enabledRegionsIds;

  //SVG c графиком
  chartSvg;
  //DOM-элемент с легендой
  legendContainer;
  //SVG c линиями
  linesContainer;
  //Доп опции
  extraElement;
  //Данные
  data;
  //Флаг выбрана ли линия
  singleLineSelected = false;

  //Группа графика Вороного
  voronoiGroup;

  //Точка на графике
  hoverDot;

  //Значения для легенды
  legendsValues;
  //Даты для легенды
  legendsDate;

  //
  percentsByDate = {};

  //Переменные для управления зумом
  rescaledX = this.x;
  rescaledY = this.y;

  //Настройки самого зума
  zoom;

  //Настройки для оси X
  xAxis;
  //Настройки для оси Y
  yAxis;
  //Сама ось X
  xAxisElement;
  //Сама ось Y
  yAxisElement;

  constructor(data, chartSvg, legendContainer, extraElement) {
    this.chartSvg = chartSvg;
    this.legendContainer = legendContainer;
    this.extraElement = extraElement;
    this.data = data;
  }

  buildAll() {
    this.chartSvg = d3
      .select(this.chartSvg)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.buildAxis();
    this.divideByRegions();
    this.buildLegendTest();
    this.buildChart();
    this.buildExtraOption();
    this.handleZoom();
    this.handleVoronoi();
  }

  //Разделяет на регионы
  divideByRegions() {
    const nestByRegionId = d3
      .nest()
      .key(d => d.regionId)
      .sortKeys((v1, v2) => (parseInt(v1, 10) > parseInt(v2, 10) ? 1 : -1))
      .entries(this.data);

    nestByRegionId.forEach(item => {
      this.regionsNamesById[item.key] = item.values[0].regionName;
    });

    d3.map(this.data, d => d.regionId)
      .keys()
      .forEach((d, i) => {
        this.regions[d] = { data: nestByRegionId[i].values, enabled: true };
      });

    this.regionsIds = Object.keys(this.regions);
  }

  buildChart(showingRegionsIds?) {
    //Ищет включенные графики

    this.enabledRegionsIds =
      showingRegionsIds || this.regionsIds.filter(regionId => this.regions[regionId].enabled);

    //Выбирает все включенные графики
    const paths = this.linesContainer.selectAll('.line').data(this.enabledRegionsIds);

    //Удаляет страые графики
    paths.exit().remove();

    //Функция для отрисовки одной единицы графика
    const lineGenerator = d3
      .line()
      .x(d => this.rescaledX(d.date))
      .y(d => this.rescaledY(d.percent))
      .curve(d3.curveCardinal);

    const nestByDate = d3
      .nest()
      .key(d => d.date)
      .entries(this.data);

    nestByDate.forEach(dateItem => {
      this.percentsByDate[dateItem.key] = {};

      dateItem.values.forEach(item => {
        this.percentsByDate[dateItem.key][item.regionId] = item.percent;
      });
    });

    //Рисует все включенные графики
    paths
      .enter()
      .append('path')
      .merge(paths)
      .attr('class', 'line')
      .attr('id', regionId => `region-${regionId}`)
      .attr('d', regionId => lineGenerator(this.regions[regionId].data))
      .style('stroke', regionId => this.colorScale(regionId));

    let _this = this;
    //Управляет отображением на легенде
    this.legendContainer.each(function(regionId) {
      const isEnabledRegion = _this.enabledRegionsIds.indexOf(regionId) >= 0;

      d3.select(this).classed('disabled', !isEnabledRegion);
    });
  }

  buildAxis() {
    d3.timeFormatDefaultLocale(chartLocale);

    //console.log(d3.extent(this.data, d => d.date));
    // console.log(d3.extent(this.time, d => d));

    this.x.domain(d3.extent(this.data, d => d.date));
    this.y.domain([0, d3.max(this.data, d => d.percent)]);
    this.colorScale.domain(d3.map(this.data, d => d.regionId).keys());

    //Ось х
    this.xAxis = d3
      .axisBottom(this.x)
      .ticks(((this.width + 2) / (this.height + 2)) * 5)
      .tickSize(-this.height - 6)
      .tickPadding(10);
    //Ось Y
    this.yAxis = d3
      .axisRight(this.y)
      .ticks(5)
      .tickSize(7 + this.width)
      .tickPadding(-15 - this.width)
      .tickFormat(d => d + '%');

    //Рисует значения оси X
    this.xAxisElement = this.chartSvg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${this.height + 6})`)
      .call(this.xAxis);

    //Рисует значения оси Y
    this.yAxisElement = this.chartSvg
      .append('g')
      .attr('transform', 'translate(-7, 0)')
      .attr('class', 'axis y-axis')
      .call(this.yAxis);

    //Рисует ось Y
    this.chartSvg
      .append('g')
      .attr('transform', `translate(0,${this.height})`)
      .call(d3.axisBottom(this.x).ticks(0));

    //Рисует ось X
    this.chartSvg.append('g').call(d3.axisLeft(this.y).ticks(0));

    //Ограничивает область видимости
    this.chartSvg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', this.width)
      .attr('height', this.height);

    this.linesContainer = this.chartSvg.append('g').attr('clip-path', 'url(#clip)');
  }

  buildLegendTest() {
    //Разбивает легенду на 3 наиболее полные части
    const chunkedRegionsIds = chunkHelper(this.regionsIds, 3);

    //Строит легенду и вешает обработчик
    const legends = this.legendContainer
      .selectAll('div.legend-column')
      .data(chunkedRegionsIds)
      .enter()
      .append('div')
      .attr('class', 'legend-column')
      .selectAll('div.legend-item')
      .data(d => d)
      .enter()
      .append('div')
      .attr('class', 'legend-item')
      .on('click', regionId => {
        if (this.singleLineSelected) {
          const newEnabledRegions =
            this.singleLineSelected === regionId ? [] : [this.singleLineSelected, regionId];
          this.regionsIds.forEach(currentRegionId => {
            this.regions[currentRegionId].enabled = newEnabledRegions.indexOf(currentRegionId) >= 0;
          });
        } else {
          this.regions[regionId].enabled = !this.regions[regionId].enabled;
        }
        this.singleLineSelected = false;
        this.buildChart();
      });

    //Строит кружки
    legends
      .append('div')
      .attr('class', 'legend-item-color')
      .style('background-color', regionId => this.colorScale(regionId));

    //Строит названия
    legends
      .append('div')
      .attr('class', 'legend-item-text')
      .text(regionId => this.regionsNamesById[regionId]);

    //Добавляет у элемента в легенде информацию
    this.legendsValues = legends.append('div').attr('class', 'legend-value');

    this.legendsDate = d3
      .selectAll('.legend-column')
      .append('div')
      .attr('class', 'legend-date');
  }

  //Функция для доп.опций (Показать все, Скрыть все)
  buildExtraOption() {
    const extraOptionsContainer = d3.select(this.extraElement.nativeElement);
    //Cтроит опцию и вешает обработчик
    extraOptionsContainer
      .append('span')
      .attr('class', 'hide-all-option')
      .text('Скрыть все')
      .on('click', () => {
        this.regionsIds.forEach(regionId => {
          this.regions[regionId].enabled = false;
        });

        this.buildChart();
      });
    //Cтроит опцию и вешает обработчик
    extraOptionsContainer
      .append('span')
      .attr('class', 'show-all-option')
      .text('Показать все')
      .on('click', () => {
        this.regionsIds.forEach(regionId => {
          this.regions[regionId].enabled = true;
        });

        this.buildChart();
      });
  }

  //Вороной - алгоритм, который расчитывает ближайшую к точке линию
  handleVoronoi() {
    //Выполняет алгоритм
    const voronoi = d3
      .voronoi()
      .x(d => this.x(d.date))
      .y(d => this.y(d.percent))
      .extent([[0, 0], [this.width, this.height]]);

    //Индикатор на графике
    this.hoverDot = this.chartSvg
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 3)
      .attr('clip-path', 'url(#clip)')
      .style('visibility', 'hidden');

    //Фильтрует только открытые графики
    const filteredData = this.data.filter(
      dataItem => this.enabledRegionsIds.indexOf(dataItem.regionId) >= 0
    );

    //Добавляет сверху линейного графика график Вороного
    this.voronoiGroup = this.chartSvg
      .append('g')
      .attr('class', 'voronoi-parent')
      .attr('clip-path', 'url(#clip)')
      .append('g')
      .attr('class', 'voronoi')
      .on('mouseover', () => {
        this.legendsDate.style('visibility', 'visible');
        this.hoverDot.style('visibility', 'visible');
      })
      .on('mouseout', () => {
        this.legendsValues.text('');
        this.legendsDate.style('visibility', 'hidden');
        this.hoverDot.style('visibility', 'hidden');
      });

    d3.select('.voronoi-parent').call(this.zoom);
    d3.select('.reset-zoom-button').on('click', () => {
      this.rescaledX = this.x;
      this.rescaledY = this.y;

      d3.select('.voronoi-parent')
        .transition()
        .duration(750)
        .call(this.zoom.transform, d3.zoomIdentity);
    });

    const voronoiPaths = this.voronoiGroup.selectAll('path').data(voronoi.polygons(filteredData));

    //Очищает предыдущий график Вороного
    voronoiPaths.exit().remove();

    //Рисует график Вороного и навешивает обработчики
    voronoiPaths
      .enter()
      .append('path')
      .merge(voronoiPaths)
      .attr('d', d => (d ? `M${d.join('L')}Z` : null))
      .on('mouseover', d => {
        this.legendsDate.text(this.timeFormatter(d.data.date));

        this.legendsValues.text(dataItem => {
          const value = this.percentsByDate[d.data.date][dataItem];

          return value ? value + '%' : 'Н/Д';
        });

        d3.select(`#region-${d.data.regionId}`).classed('region-hover', true);

        this.hoverDot
          .attr('cx', () => this.rescaledX(d.data.date))
          .attr('cy', () => this.rescaledY(d.data.percent));
      })
      .on('mouseout', d => {
        if (d) {
          d3.select(`#region-${d.data.regionId}`).classed('region-hover', false);
        }
      })
      .on('click', d => {
        if (this.singleLineSelected) {
          this.singleLineSelected = false;

          this.buildChart();
        } else {
          const regionId = d.data.regionId;

          this.singleLineSelected = regionId;

          this.buildChart([regionId]);
        }
      });
  }

  //Управление зумом
  handleZoom() {
    this.zoom = d3
      .zoom()
      .scaleExtent([0.95, 10])
      .translateExtent([[-100000, -100000], [100000, 100000]])
      .on('start', () => {
        this.hoverDot.attr('cx', -5).attr('cy', 0);
      })
      .on('zoom', () => {
        const transformation = d3.event.transform;

        this.rescaledX = transformation.rescaleX(this.x);
        this.rescaledY = transformation.rescaleY(this.y);

        this.xAxisElement.call(this.xAxis.scale(this.rescaledX));
        this.yAxisElement.call(this.yAxis.scale(this.rescaledY));

        this.linesContainer.selectAll('path').attr('d', regionId => {
          return d3
            .line()
            .defined(d => d.percent !== 0)
            .x(d => this.rescaledX(d.date))
            .y(d => this.rescaledY(d.percent))
            .curve(d3.curveCardinal)(this.regions[regionId].data);
        });

        this.voronoiGroup.attr('transform', transformation);
      });
  }
}
