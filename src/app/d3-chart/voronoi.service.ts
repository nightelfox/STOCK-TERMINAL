import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { CHART_WIDTH, CHART_HEIGHT } from './chart-config';

@Injectable({
  providedIn: 'root',
})
export class VoronoiService {
  hoverDot;
  hoverDot2;
  tooltip;
  tooltipText;
  dateTooltip;
  dateTooltipText;
  mainTooltip;
  mainTooltipText;
  voronoiGroup;

  constructor() {}

  buildVoronoi(coords, elements, data, buildChart, scaleMode) {
    let regionMode;
    let dataMode;
    switch (scaleMode) {
      case 'LINEAR':
        regionMode = data.regions;
        dataMode = data.data;
        break;
      case 'PERCENTAGE':
        regionMode = data.percentRegions;
        dataMode = data.percentData;
        break;
    }

    //Выполняет алгоритм
    const voronoi = d3
      .voronoi()
      .x(d => coords.x(d.date))
      .y(d => coords.y(d.close))
      .extent([[0, 0], [CHART_WIDTH, CHART_HEIGHT]]);

    //Индикатор на графике
    elements.hoverDot = elements.chartSvg
      .append('rect')
      .attr('class', 'cross')
      .attr('width', 1)
      .attr('height', CHART_HEIGHT)
      .attr('clip-path', 'url(#clip)')
      .style('visibility', 'hidden');

    elements.hoverDot2 = elements.chartSvg
      .append('rect')
      .attr('class', 'cross')
      .attr('width', CHART_WIDTH)
      .attr('height', 1)
      .attr('clip-path', 'url(#clip)')
      .style('visibility', 'hidden');

    elements.tooltip = elements.chartSvg
      .append('rect')
      .attr('class', 'toooltip')
      .attr('width', 50)
      .attr('height', 20)
      .attr('fill', '#646464')
      .style('visibility', 'hidden');

    elements.tooltipText = elements.chartSvg
      .append('text')
      .attr('fill', 'white')
      .attr('font-size', '0.8em')
      .text('');

    elements.dateTooltip = elements.chartSvg
      .append('rect')
      .attr('class', 'toooltip')
      .attr('width', 100)
      .attr('height', 20)
      .attr('fill', '#2F2F2F')
      .attr('rx', 10)
      .attr('ry', 10)
      .style('visibility', 'hidden');

    elements.dateTooltipText = elements.chartSvg
      .append('text')
      .attr('fill', 'white')
      .attr('font-size', '0.8em')
      .text('');

    elements.mainTooltip = elements.chartSvg
      .append('rect')
      .attr('width', 50)
      .attr('height', 20)
      .attr('fill', '#1F77B4');

    data.lastValue = dataMode[dataMode.length - 1].close.toFixed(2);

    elements.mainTooltip.attr('x', -50).attr('y', coords.rescaledY(data.lastValue) - 10);

    elements.mainTooltipText = elements.chartSvg
      .append('text')
      .attr('fill', 'white')
      .attr('font-size', '0.8em')
      .text(data.lastValue);

    elements.mainTooltipText.attr('x', -48).attr('y', coords.rescaledY(data.lastValue) + 5);
    //this.tooltip
    //.append('div')
    //.attr('class', 'legend-item-text')
    //.text('aaa');

    //Фильтрует только открытые графики
    const filteredData = dataMode.filter(
      dataItem => data.enabledRegionsIds.indexOf(dataItem.regionId) >= 0
    );

    //Добавляет сверху линейного графика график Вороного
    elements.voronoiGroup = elements.chartSvg
      .append('g')
      .attr('class', 'voronoi-parent')
      .attr('clip-path', 'url(#clip)')
      .append('g')
      .attr('class', 'voronoi')
      .on('mouseover', () => {
        //this.legendsDate.style('visibility', 'visible');
        elements.hoverDot.style('visibility', 'visible');
        elements.hoverDot2.style('visibility', 'visible');
        elements.tooltip.style('visibility', 'visible');
        elements.dateTooltip.style('visibility', 'visible');
      })
      .on('mouseout', () => {
        //this.legendsDate.style('visibility', 'hidden');
        elements.hoverDot.style('visibility', 'hidden');
        elements.hoverDot2.style('visibility', 'hidden');
        elements.tooltip.style('visibility', 'hidden');
        elements.dateTooltip.style('visibility', 'hidden');
      });

    // elements.testGroup = elements.testSvg
    //   .append('g')
    //   .attr('class', 'voronoi-parent')
    //   .attr('clip-path', 'url(#clip)')
    //   .append('g')
    //   .attr('class', 'voronoi')
    //   .on('mouseover', () => {
    //     //this.legendsDate.style('visibility', 'visible');
    //     elements.hoverDot.style('visibility', 'visible');
    //     elements.hoverDot2.style('visibility', 'visible');
    //     elements.tooltip.style('visibility', 'visible');
    //     elements.dateTooltip.style('visibility', 'visible');
    //   })
    //   .on('mouseout', () => {
    //     elements.legendsValues.text('');
    //     //this.legendsDate.style('visibility', 'hidden');
    //     elements.hoverDot.style('visibility', 'hidden');
    //     elements.hoverDot2.style('visibility', 'hidden');
    //     elements.tooltip.style('visibility', 'hidden');
    //     elements.dateTooltip.style('visibility', 'hidden');
    //   });

    d3.select('.voronoi-parent').call(elements.zoom);

    d3.select('.reset-zoom-button').on('click', () => {
      coords.rescaledX = coords.x;
      coords.rescaledY = coords.y;

      d3.select('.voronoi-parent')
        .transition()
        .duration(750)
        .call(elements.zoom.transform, d3.zoomIdentity);
    });

    const voronoiPaths = elements.voronoiGroup
      .selectAll('path')
      .data(voronoi.polygons(filteredData));

    //Очищает предыдущий график Вороного
    voronoiPaths.exit().remove();

    //Рисует график Вороного и навешивает обработчики
    voronoiPaths
      .enter()
      .append('path')
      .merge(voronoiPaths)
      .attr('d', d => (d ? `M${d.join('L')}Z` : null))
      .on('mouseover', d => {
        //this.legendsDate.text(this.timeFormatter(d.data.date));

        elements.legendsValues.text(dataItem => {
          console.log(data);
          let close;
          const value = data.percentsByDate[d.data.date][dataItem];
          if (value.closeConst) {
            close = value.closeConst;
          } else {
            close = value.close;
          }
          const ohlc = `O:${value.open.toFixed(2)}\nH:${value.high.toFixed(
            2
          )}\nL:${value.low.toFixed(2)}\nC:${close.toFixed(2)}`;
          return ohlc;
        });

        d3.select(`#region-${d.data.regionId}`).classed('region-hover', true);

        elements.hoverDot.attr('x', () => coords.rescaledX(d.data.date)).attr('y', 0);
        elements.hoverDot2.attr('x', 0).attr('y', coords.rescaledY(d.data.close));

        if (d.data.regionId === '1') {
          elements.tooltip.attr('x', -50).attr('y', coords.rescaledY(d.data.close) - 10);
          elements.tooltipText.attr('x', -48).attr('y', coords.rescaledY(d.data.close) + 5);
          elements.tooltipText.text(d.data.close.toFixed(2));
          elements.dateTooltip
            .attr('x', coords.rescaledX(d.data.date) - 50)
            .attr('y', CHART_HEIGHT + 3);
          elements.dateTooltipText
            .attr('x', coords.rescaledX(d.data.date) - 25)
            .attr('y', CHART_HEIGHT + 18);
          elements.dateTooltipText.text(d.data.label);
        }
      })
      .on('mouseout', d => {
        if (d) {
          d3.select(`#region-${d.data.regionId}`).classed('region-hover', false);
        }
      })
      .on('click', d => {
        if (elements.singleLineSelected) {
          elements.singleLineSelected = false;

          buildChart();
        } else {
          const regionId = d.data.regionId;

          elements.singleLineSelected = regionId;

          buildChart([regionId]);
        }
      });

    this.hoverDot = elements.hoverDot;
    this.hoverDot2 = elements.hoverDot2;
    this.tooltip = elements.tooltip;
    this.tooltipText = elements.tooltipText;
    this.dateTooltip = elements.dateTooltip;
    this.dateTooltipText = elements.dateTooltipText;
    this.mainTooltip = elements.mainTooltip;
    this.mainTooltipText = elements.mainTooltipText;
    this.voronoiGroup = elements.voronoiGroup;
  }
}
