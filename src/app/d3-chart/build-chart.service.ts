import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { colorScale, CHART_HEIGHT, CHART_WIDTH } from './chart-config';

@Injectable({
  providedIn: 'root',
})
export class BuildChartService {
  candles;
  stems;

  constructor() {}

  buildChart(elements, coords, data, chartMode?) {
    //Выбирает все включенные графики
    const paths = elements.linesContainer.selectAll('.line').data(data.enabledRegionsIds);
    //const testPaths = elements.testLinesContainer.selectAll('.line').data(data.enabledRegionsIds);

    //Удаляет страые графики
    paths.exit().remove();
    //testPaths.exit().remove();

    //Функция для отрисовки одной единицы графика
    const lineGenerator = d3
      .area()
      .x(d => coords.rescaledX(d.date))
      .y(d => coords.rescaledY(d.close));
    // .curve(d3.curveCardinal);

    const nestByDate = d3
      .nest()
      .key(d => d.date)
      .entries(elements.dataMode);

    nestByDate.forEach(dateItem => {
      data.percentsByDate[dateItem.key] = {};

      dateItem.values.forEach(item => {
        data.percentsByDate[dateItem.key][item.regionId] = item;
      });
    });

    //Рисует все включенные графики

    switch (chartMode) {
      case 'LINE':
        paths
          .enter()
          .append('path')
          .merge(paths)
          .attr('class', 'line')
          .attr('id', regionId => `region-${regionId}`)
          .attr('d', regionId => lineGenerator(elements.regionMode[regionId].data))
          .style('stroke', regionId => colorScale(regionId));
        // testPaths
        //   .enter()
        //   .append('path')
        //   .merge(testPaths)
        //   .attr('class', 'line')
        //   .attr('id', regionId => `region-${regionId}`)
        //   .attr('d', regionId => lineGenerator(elements.regionMode[regionId].data))
        //   .style('stroke', regionId => colorScale(regionId));
        break;
      case 'CANDLE':
        paths
          .enter()
          .append('path')
          .merge(paths)
          .attr('class', 'line')
          .attr('id', regionId => `region-${regionId}`)
          .attr('d', regionId => lineGenerator(elements.regionMode[regionId].data))
          .style('stroke', regionId => (regionId === '1' ? 'transparent' : colorScale(regionId)));

        this.buildCandles(coords, elements, data);
        break;
    }
    //Управляет отображением на легенде
    elements.legendContainer.each(function(regionId) {
      const isEnabledRegion = data.enabledRegionsIds.indexOf(regionId) >= 0;

      d3.select(this).classed('disabled', !isEnabledRegion);
    });
  }

  buildCandles(coords, elements, data) {
    console.log('svechi', data);
    const ymax = d3.max(data.regions['1'].data.map(r => r.high));
    const ymin = d3.min(data.regions['1'].data.map(r => r.low));

    console.log(ymin, ymax);

    const xBand = d3
      .scaleBand()
      .domain(d3.range(0, elements.chartDates.length))
      .range([0, CHART_WIDTH])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([ymin, ymax])
      .range([CHART_HEIGHT, 0])
      .nice();

    const chartBody = elements.chartSvg
      .append('g')
      .attr('class', 'chartBody')
      .attr('clip-path', 'url(#clip)');

    // Рисует прямоугольники
    this.candles = chartBody
      .selectAll('.candle')
      .data(data.regions['1'].data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => coords.rescaledX(d.date) - xBand.bandwidth() / 2)
      .attr('class', 'candle')
      .attr('y', d => yScale(Math.max(d.open, d.close)))
      .attr('width', xBand.bandwidth())
      .attr('height', d =>
        d.open === d.close
          ? 1
          : yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close))
      )
      .attr('fill', d =>
        d.open === d.close ? 'silver' : d.open > d.close ? '#FF4D4D' : '#33FF77'
      );

    // Рисует тени
    this.stems = chartBody
      .selectAll('g.line')
      .data(data.regions['1'].data)
      .enter()
      .append('line')
      .attr('class', 'stem')
      .attr('x1', d => coords.rescaledX(d.date))
      .attr('x2', d => coords.rescaledX(d.date))
      .attr('y1', d => yScale(d.high))
      .attr('y2', d => yScale(d.low))
      .attr('stroke', d =>
        d.open === d.close ? 'white' : d.open > d.close ? '#FF4D4D' : '#33FF77'
      );
  }

  buildBars(coords, elements, data) {
    console.log('bars', data);
    const ymax = d3.max(data.regions['1'].data.map(r => r.volume / 1000));
    const ymin = 0;

    console.log(ymin, ymax);

    const xBand = d3
      .scaleBand()
      .domain(d3.range(0, elements.chartDates.length))
      .range([0, CHART_WIDTH])
      .padding(0.5);

    const yScale = d3
      .scaleLinear()
      .domain([ymin, ymax])
      .range([CHART_HEIGHT, 0])
      .nice();

    const chartBody = elements.chartSvg
      .append('g')
      .attr('class', 'chartBody')
      .attr('clip-path', 'url(#clip)');

    // Рисует прямоугольники
    this.candles = chartBody
      .selectAll('.candle')
      .data(data.regions['1'].data)
      .enter()
      .append('rect')
      .attr('x', (d, i) => coords.rescaledX(d.date) - xBand.bandwidth() / 2)
      .attr('class', 'candle')
      .attr('y', d => yScale(Math.max(d.open, d.close)))
      .attr('width', xBand.bandwidth())
      .attr('height', d =>
        d.open === d.close
          ? 1
          : yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close))
      )
      .attr('fill', d =>
        d.open === d.close ? 'silver' : d.open > d.close ? '#FF4D4D' : '#33FF77'
      );

    // Рисует тени
    this.stems = chartBody
      .selectAll('g.line')
      .data(data.regions['1'].data)
      .enter()
      .append('line')
      .attr('class', 'stem')
      .attr('x1', d => coords.rescaledX(d.date))
      .attr('x2', d => coords.rescaledX(d.date))
      .attr('y1', d => yScale(d.high))
      .attr('y2', d => yScale(d.low))
      .attr('stroke', d =>
        d.open === d.close ? 'white' : d.open > d.close ? '#FF4D4D' : '#33FF77'
      );
  }
}
