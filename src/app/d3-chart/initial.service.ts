import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { CHART_WIDTH, CHART_HEIGHT, margin } from './chart-config';

@Injectable({
  providedIn: 'root',
})
export class InitialService {
  constructor() {}

  initialChart(elementId) {
    return d3
      .select(elementId)
      .append('svg')
      .attr('width', CHART_WIDTH + margin.left + margin.right)
      .attr('height', CHART_HEIGHT + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  }

  initialTestChart(elementId) {
    return d3
      .select(elementId)
      .append('svg')
      .attr('width', CHART_WIDTH + margin.left + margin.right)
      .attr('height', 100)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
  }
}
