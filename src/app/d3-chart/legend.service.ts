import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { chunkHelper } from './utils/d3-chart-utils';
import { colorScale } from './chart-config';
import { BuildChartService } from './build-chart.service';

@Injectable({
  providedIn: 'root',
})
export class LegendService {
  legendContainer;
  legendsValues;

  constructor() {}

  buildLegend(elements, data, buildChart) {
    //Разбивает легенду на 3 наиболее полные части
    const chunkedRegionsIds = chunkHelper(data.regionsIds, 1);
    elements.legendContainer.selectAll('*').remove();
    //Строит легенду и вешает обработчик
    const legends = elements.legendContainer
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
        if (elements.singleLineSelected) {
          const newEnabledRegions =
            elements.singleLineSelected === regionId ? [] : [elements.singleLineSelected, regionId];
          data.regionsIds.forEach(currentRegionId => {
            elements.regionMode[currentRegionId].enabled =
              newEnabledRegions.indexOf(currentRegionId) >= 0;
          });
        } else {
          elements.regionMode[regionId].enabled = !elements.regionMode[regionId].enabled;
        }
        elements.singleLineSelected = false;
        buildChart();
      });

    //Строит кружки
    legends
      .append('div')
      .attr('class', 'legend-item-color')
      .style('background-color', regionId => colorScale(regionId));

    //Строит названия
    legends
      .append('div')
      .attr('class', 'legend-item-text')
      .text(regionId => data.regionsNamesById[regionId]);

    //Добавляет у элемента в легенде информацию
    elements.legendsValues = legends.append('div').attr('class', 'legend-value');
    this.legendContainer = elements.legendContainer;
    this.legendsValues = elements.legendsValues;
    // this.legendsDate = d3
    //   .selectAll('.legend-column')
    //   .append('div')
    //   .attr('class', 'legend-date');
  }
}
