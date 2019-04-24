import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { CHART_HEIGHT, CHART_WIDTH, colorScale } from './chart-config';

@Injectable({
  providedIn: 'root',
})
export class AxisService {
  linesContainer;
  xAxis;
  yAxis;
  xAxisElement;
  yAxisElement;
  chartSvg;
  x;
  y;
  constructor() {}

  buildAxis(coords, elements, data, scaleMode) {
    coords.x.domain(d3.extent(data.data, d => d.date));
    switch (scaleMode) {
      case 'LINEAR':
        coords.y.domain([
          d3.min(data.data, d => d.close) - 50,
          d3.max(data.data, d => d.close) + 10,
        ]);
        break;
      case 'PERCENTAGE':
        coords.y.domain([
          d3.min(data.percentData, d => +d.close) - 2,
          d3.max(data.percentData, d => +d.close) + 2,
        ]);
        break;
    }

    colorScale.domain(d3.map(data.data, d => d.regionId).keys());

    elements.chartSvg.selectAll('*').remove();
    //Ось х
    elements.xAxis = d3
      .axisBottom(coords.x)
      .ticks(((CHART_WIDTH + 2) / (CHART_HEIGHT + 2)) * 5)
      .tickSize(-CHART_HEIGHT - 6)
      .tickPadding(10)
      .tickFormat('');

    // const testXAxis = d3
    //   .axisBottom(elements.xTest)
    //   .ticks(((CHART_WIDTH + 2) / (100 + 2)) * 5)
    //   .tickSize(-100 - 6)
    //   .tickPadding(10)
    //   .tickFormat('');
    //Ось Y
    elements.yAxis = d3
      .axisRight(coords.y)
      .ticks(5)
      .tickSize(7 + CHART_WIDTH)
      .tickPadding(-15 - CHART_WIDTH)
      .tickFormat(d => d + coords.yFormat);

    // const testYAxis = d3
    //   .axisRight(elements.yTest)
    //   .ticks(5)
    //   .tickSize(7 + CHART_WIDTH)
    //   .tickPadding(-15 - CHART_WIDTH)
    //   .tickFormat(d => d + coords.yFormat);

    //Рисует значения оси X
    elements.xAxisElement = elements.chartSvg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', `translate(0,${CHART_HEIGHT + 6})`)
      .call(elements.xAxis);

    //Рисует значения оси Y
    elements.yAxisElement = elements.chartSvg
      .append('g')
      .attr('transform', 'translate(-7, 0)')
      .attr('class', 'axis y-axis')
      .call(elements.yAxis);

    //Рисует ось Y
    elements.chartSvg
      .append('g')
      .attr('transform', `translate(0,${CHART_HEIGHT})`)
      .call(d3.axisBottom(coords.x).ticks(0));

    //Рисует ось X
    elements.chartSvg.append('g').call(d3.axisLeft(coords.y).ticks(0));

    //Ограничивает область видимости
    elements.chartSvg
      .append('defs')
      .append('clipPath')
      .attr('id', 'clip')
      .append('rect')
      .attr('width', CHART_WIDTH)
      .attr('height', CHART_HEIGHT);

    // elements.testXAxisElement = elements.testSvg
    //   .append('g')
    //   .attr('class', 'axis x-axis')
    //   .attr('transform', `translate(0,100)`)
    //   .call(testXAxis);

    // elements.testYAxisElement = elements.testSvg
    //   .append('g')
    //   .attr('transform', 'translate(-7, 0)')
    //   .attr('class', 'axis y-axis')
    //   .call(testYAxis);

    // elements.testSvg
    //   .append('g')
    //   .attr('transform', `translate(0,100)`)
    //   .call(d3.axisBottom(elements.xTest).ticks(0));

    // elements.testSvg.append('g').call(d3.axisLeft(elements.yTest).ticks(0));

    // elements.testSvg
    //   .append('defs')
    //   .append('clipPath')
    //   .attr('id', 'clip')
    //   .append('rect')
    //   .attr('width', CHART_WIDTH)
    //   .attr('height', 100);

    elements.linesContainer = elements.chartSvg.append('g').attr('clip-path', 'url(#clip)');

    this.linesContainer = elements.linesContainer;
    this.xAxis = elements.xAxis;
    this.yAxis = elements.yAxis;
    this.xAxisElement = elements.xAxisElement;
    this.yAxisElement = elements.yAxisElement;
    this.chartSvg = elements.chartSvg;
    this.x = coords.x;
    this.y = coords.y;
    //elements.testLinesConstainer = elements.testSvg.append('g').attr('clip-path', 'url(#clip)');
  }
}
