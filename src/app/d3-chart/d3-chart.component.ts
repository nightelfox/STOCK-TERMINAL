import { Component, OnInit, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';

import * as d3 from 'd3';

import { IexFetchingService } from '../services/iex-fetching.service';
import { processData, process1Day, processMonth } from './utils/d3-chart-utils';
import { CHART_HEIGHT, CHART_WIDTH } from './chart-config';

import { merge, tap } from 'rxjs/operators';

import { ChartTypeService } from '../services/chart-type.service';
import { ZoomService } from './zoom.service';
import { chartAreaWidth, chartAreaHeight } from './chart-config';
import { BuildChartService } from './build-chart.service';
import { DivisonService } from './divison.service';
import { AxisService } from './axis.service';
import { LegendService } from './legend.service';
import { VoronoiService } from './voronoi.service';
import { InitialService } from './initial.service';

@Component({
  selector: 'app-d3-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './d3-chart.component.html',
  styleUrls: ['./d3-chart.component.css'],
})
export class D3ChartComponent implements OnInit {
  //DOM-элемент графика
  @ViewChild('chart')
  chartElement: ElementRef;
  //DOM-элемент легенды
  @ViewChild('legend')
  legendElement: ElementRef;
  //DOM-элемент доп.опций
  @ViewChild('extraOptions')
  extraElement: ElementRef;
  @ViewChild('testChart')
  testChart: ElementRef;

  //Данные
  data;
  percentData = [];
  //Размер оси Х
  x = d3.scaleTime().range([0, CHART_WIDTH]);
  //Размер оси Y
  y = d3.scaleLinear().range([CHART_HEIGHT, 0]);
  //Размер оси Х
  xTest = d3.scaleTime().range([0, CHART_WIDTH]);
  //Размер оси Y
  yTest = d3.scaleLinear().range([100, 0]);

  //Названия графиков
  regionsNamesById = {};
  //Сами графики
  regions = {};
  //Графики в процентах
  percentRegions = {};
  //ID графиков
  regionsIds;
  //ID включенных графиков
  enabledRegionsIds;
  //Даты
  chartDates = [];
  //SVG c графиком
  chartSvg;
  testSvg;
  //DOM-элемент с легендой
  legendContainer;
  //SVG c линиями
  linesContainer;
  testLinesContainer;
  //Флаг выбрана ли линия
  singleLineSelected = false;

  //Группа графика Вороного
  voronoiGroup;
  testGroup;
  //Точка на графике
  hoverDot;
  hoverDot2;
  //Tooltip
  tooltip;
  tooltipText;
  //dateTootip
  dateTooltip;
  dateTooltipText;
  //MainTooltip
  mainTooltip;
  mainTooltipText;
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

  testXAxisElement;
  testYAxisElement;

  symbol = 'googl';
  timeScale = '1m';
  currentValue;
  lastValue;

  SCALE_MODE = 'LINEAR';
  regionMode;
  dataMode;
  yFormat;

  CHART_MODE = 'LINE';

  candles;
  stems;
  xBand;

  constructor(
    private chartData: IexFetchingService,
    private chartType: ChartTypeService,
    private initial: InitialService,
    private zoomService: ZoomService,
    private buildChartService: BuildChartService,
    private divisionService: DivisonService,
    private axisService: AxisService,
    private legendService: LegendService,
    private voronoiService: VoronoiService
  ) {}

  ngOnInit() {
    //Выделяет график
    this.chartSvg = this.initial.initialChart(this.chartElement.nativeElement);

    //this.testSvg = this.initial.initialTestChart(this.chartElement.nativeElement);

    this.legendContainer = d3.select(this.legendElement.nativeElement);

    const chartType$ = this.chartType.chartType.pipe(
      tap(d => {
        if (d) {
          this.CHART_MODE = d;
        }
      })
    );

    const month$ = this.chartData.monthScale.pipe(
      tap(d => {
        if (d) {
          this.timeScale = d;
        }
      })
    );

    const symbol$ = this.chartData.symbolMonthStats.pipe(
      tap(d => {
        if (d) {
          this.symbol = d.symbol;
        }
      })
    );

    const chartSettings$ = month$.pipe(
      merge(symbol$),
      merge(chartType$)
    );

    chartSettings$.subscribe(d =>
      this.chartData
        .getChart(this.symbol, this.timeScale)
        .pipe(
          tap(d => {
            this.regionsNamesById = {};
            this.regionsNamesById[1] = this.symbol;
            this.regions = {};
            this.percentRegions = {};
            this.clearSvgs();
            this.setMainChartData(d);
          })
        )
        .subscribe()
    );

    this.chartData.compare.subscribe(res => {
      if (res !== '') {
        if (Object.values(this.regionsNamesById).indexOf(res.symbol) === -1) {
          const chartId = +this.data[this.data.length - 1].regionId + 1;
          if (this.timeScale === '1d') {
            res.data = processData(res.data);
            this.data = this.data.concat(process1Day(res.data, chartId));
          } else {
            this.data = this.data.concat(processMonth(res.data, chartId));
          }
          this.regionsNamesById[chartId] = res.symbol;

          this.SCALE_MODE = 'PERCENTAGE';
          this.createChart();
        }
      }
    });
  }

  clearSvgs() {
    this.chartSvg.selectAll('*').remove();
    this.legendContainer.selectAll('*').remove();
    //this.testSvg.selectAll('*').remove();
  }

  setChartMode() {
    switch (this.SCALE_MODE) {
      case 'LINEAR':
        this.SCALE_MODE = 'LINEAR';
        this.regionMode = this.regions;
        this.dataMode = this.data;
        this.yFormat = '';
        break;
      case 'PERCENTAGE':
        this.SCALE_MODE = 'PERCENTAGE';
        this.regionMode = this.percentRegions;
        this.dataMode = this.percentData;
        this.yFormat = '%';
        break;
    }
  }

  setMainChartData(d) {
    this.chartDates = [];
    if (this.timeScale === '1d') {
      d = processData(d);
      d.chart.forEach(element => {
        element.regionId = '1';
        element.date = new Date(`2019-04-24T${element.minute}:00.000Z`);
        this.chartDates.push(element.date.toString().slice(0, 15));
      });
    } else {
      d.chart.forEach(element => {
        element.regionId = '1';
        element.date = new Date(element.date);
        this.chartDates.push(element.date.toString().slice(0, 15));
      });
    }

    this.data = d.chart;
    this.percentData = [];

    this.createChart();
  }

  createChart() {
    this.setChartMode();
    this.divideByRegions();
    this.buildAxis();
    this.buildChart();
    this.buildLegend();
    this.handleZoom();
    this.handleVoronoi();
  }

  buildAxis() {
    const data = this.getChartData();
    const elements = this.getElementsObject();
    const coords = this.getCoordObject();

    this.axisService.buildAxis(coords, elements, data, this.SCALE_MODE);

    this.linesContainer = this.axisService.linesContainer;
    //this.testLinesContainer = this.axisService.testLinesContainer;
    this.xAxis = this.axisService.xAxis;
    this.yAxis = this.axisService.yAxis;
    this.xAxisElement = this.axisService.xAxisElement;
    this.yAxisElement = this.axisService.yAxisElement;
    this.chartSvg = this.axisService.chartSvg;
    this.x = this.axisService.x;
    this.y = this.axisService.y;
  }

  //Разделяет на регионы
  divideByRegions() {
    const data = this.getChartData();

    this.divisionService.divide(data);

    this.data = this.divisionService.data;
    this.percentRegions = this.divisionService.percentRegions;
    this.regionsIds = this.divisionService.regionsIds;
    this.percentData = this.divisionService.percentData;
  }

  //Строит графики
  buildChart(showingRegionsIds?) {
    this.enabledRegionsIds =
      showingRegionsIds || this.regionsIds.filter(regionId => this.regionMode[regionId].enabled);

    const elements = this.getElementsObject();
    const data = this.getChartData();
    const coords = this.getCoordObject();

    this.buildChartService.buildChart(elements, coords, data, this.CHART_MODE);
    this.candles = this.buildChartService.candles;
    this.stems = this.buildChartService.stems;
  }

  buildLegend() {
    const elements = this.getElementsObject();
    const data = this.getChartData();

    this.legendService.buildLegend(elements, data, this.buildChart.bind(this));

    this.legendContainer = this.legendService.legendContainer;
    this.legendsValues = this.legendService.legendsValues;
  }

  //Вороной - алгоритм, который расчитывает ближайшую к точке линию
  handleVoronoi() {
    const coords = this.getCoordObject();
    const elements = this.getElementsObject();
    const data = this.getChartData();

    this.voronoiService.buildVoronoi(
      coords,
      elements,
      data,
      this.buildChart.bind(this),
      this.SCALE_MODE
    );

    this.hoverDot = this.voronoiService.hoverDot;
    this.hoverDot2 = this.voronoiService.hoverDot2;
    this.tooltip = this.voronoiService.tooltip;
    this.tooltipText = this.voronoiService.tooltipText;
    this.dateTooltip = this.voronoiService.dateTooltip;
    this.dateTooltipText = this.voronoiService.dateTooltipText;
    this.mainTooltip = this.voronoiService.mainTooltip;
    this.mainTooltipText = this.voronoiService.mainTooltipText;
    this.voronoiGroup = this.voronoiService.voronoiGroup;
  }

  //Управление зумом
  handleZoom() {
    const coords = this.getCoordObject();
    const elements = this.getElementsObject();
    const data = this.getChartData();
    this.zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent([[0, 0], [chartAreaWidth, chartAreaHeight]])
      .extent([[0, 0], [chartAreaWidth, chartAreaHeight]])
      .on('start', () => {
        this.zoomService.handleCrosshair(elements);
      })
      .on('zoom.end', () => {
        this.zoomService.zoomEnd(elements, this.CHART_MODE, data);
      })
      .on('zoom', () => {
        this.zoomService.zoom(coords, elements, this.CHART_MODE);
      });
  }

  getCoordObject() {
    return {
      x: this.x,
      y: this.y,
      rescaledX: this.rescaledX,
      rescaledY: this.rescaledY,
      yFormat: this.yFormat,
    };
  }

  getElementsObject() {
    return {
      candles: this.candles,
      stems: this.stems,
      xAxis: this.xAxis,
      yAxis: this.yAxis,
      xTest: this.xTest,
      ytest: this.yTest,
      xAxisElement: this.xAxisElement,
      testXAxisElement: this.testXAxisElement,
      testYAxisElement: this.testYAxisElement,
      linesContainer: this.linesContainer,
      legendContainer: this.legendContainer,
      testLinesContainer: this.testLinesContainer,
      regionMode: this.regionMode,
      dataMode: this.dataMode,
      mainTooltip: this.mainTooltip,
      mainTooltipText: this.mainTooltipText,
      voronoiGroup: this.voronoiGroup,
      testGroup: this.testGroup,
      chartDates: this.chartDates,
      hoverDot: this.hoverDot,
      hoverDot2: this.hoverDot2,
      chartSvg: this.chartSvg,
      testSvg: this.testSvg,
      singleLineSelected: this.singleLineSelected,
      legendsValues: this.legendsValues,
      zoom: this.zoom,
      tooltip: this.tooltip,
      tooltipText: this.tooltipText,
      dateTooltip: this.dateTooltip,
      dateTooltipText: this.dateTooltipText,
    };
  }

  getChartPreferences() {
    return {
      CHART_MODE: this.CHART_MODE,
    };
  }

  getChartData() {
    return {
      data: this.data,
      percentData: this.percentData,
      enabledRegionsIds: this.enabledRegionsIds,
      regionsNamesById: this.regionsNamesById,
      percentsByDate: this.percentsByDate,
      regionsIds: this.regionsIds,
      percentRegions: this.percentRegions,
      regions: this.regions,
      lastValue: this.lastValue,
    };
  }
}
