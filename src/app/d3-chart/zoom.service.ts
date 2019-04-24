import { Injectable } from '@angular/core';
import { ChartTypeService } from '../services/chart-type.service';
import { CHART_WIDTH, CHART_HEIGHT } from './chart-config';
import * as d3 from 'd3';

@Injectable({
  providedIn: 'root',
})
export class ZoomService {
  constructor(private chartType: ChartTypeService) {}

  zoom(coords, elements, chartMode) {
    const transformation = d3.event.transform;

    const xBand = d3
      .scaleBand()
      .domain(d3.range(0, elements.chartDates.length))
      .range([0, CHART_WIDTH])
      .padding(0.5);
    const rightEdge =
      Math.abs(transformation.x) / transformation.k + CHART_WIDTH / transformation.k;
    const bottomEdge =
      Math.abs(transformation.y) / transformation.k + CHART_HEIGHT / transformation.k;

    if (rightEdge > CHART_WIDTH) {
      transformation.x = -(CHART_WIDTH * transformation.k - CHART_WIDTH);
    }

    if (bottomEdge > CHART_HEIGHT) {
      transformation.y = -(CHART_HEIGHT * transformation.k - CHART_HEIGHT);
    }

    coords.rescaledX = transformation.rescaleX(coords.x);

    if (chartMode === 'CANDLE') {
      elements.candles
        .attr('x', (d, i) => coords.rescaledX(d.date) - (xBand.bandwidth() * transformation.k) / 2)
        .attr('width', xBand.bandwidth() * transformation.k);
      elements.stems.attr(
        'x1',
        (d, i) => coords.rescaledX(d.date) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
      );
      elements.stems.attr(
        'x2',
        (d, i) => coords.rescaledX(d.date) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
      );
    }

    elements.xAxisElement.call(elements.xAxis.scale(coords.rescaledX));

    //elements.testXAxisElement.call(elements.xAxis.scale(coords.rescaledX));
    // elements.testYAxisElement.call(elements.yAxis.scale(coords.rescaledY));

    elements.linesContainer.selectAll('path').attr('d', regionId => {
      return d3
        .line()
        .defined(d => d.close !== 0)
        .x(d => coords.rescaledX(d.date))
        .y(d => coords.rescaledY(d.close))(elements.regionMode[regionId].data);
    });

    const zoomDomain = coords.rescaledX.domain();
    const firstDate = zoomDomain[0].toString().slice(0, 15);
    const secondDate = zoomDomain[1].toString().slice(0, 15);

    const index1 = elements.chartDates.indexOf(firstDate);
    const index2 = elements.chartDates.indexOf(secondDate);

    if (index1 !== -1 && index2 !== -1) {
      const second = elements.dataMode[index2].close;
      elements.mainTooltip.attr('x', -50).attr('y', coords.rescaledY(second) - 10);
      elements.mainTooltipText.attr('x', -48).attr('y', coords.rescaledY(second) + 5);
      elements.mainTooltipText.text(second.toFixed(2));
    }

    elements.voronoiGroup.attr('transform', transformation);
    //elements.testGroup.attr('transform', transformation);
  }

  zoomEnd(elements, chartMode, data) {
    if (chartMode === 'CANDLE') {
      const t = d3.event.transform;
      const ymin = d3.min(data.regions['1'].data.map(r => r.low));
      const ymax = d3.max(data.regions['1'].data.map(r => r.high));
      const xDateScale = d3
        .scaleQuantize()
        .domain([0, elements.chartDates.length])
        .range(elements.chartDates);
      const yScale = d3
        .scaleLinear()
        .domain([ymin, ymax])
        .range([CHART_HEIGHT, 0])
        .nice();
      const xScale = d3
        .scaleTime()
        .domain([0, elements.chartDates.length])
        .range([0, CHART_WIDTH]);
      const xScaleZ = t.rescaleX(xScale);

      const xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])));
      const xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])));
      const temp = [];
      data.regions['1'].data.forEach(element => {
        if (element.date >= xmin && element.date <= xmax) temp.push(element);
      });
      const filtered = temp;
      const minP = +d3.min(filtered, d => d.low);
      const maxP = +d3.max(filtered, d => d.high);
      const buffer = Math.floor((maxP - minP) * 0.1);

      yScale.domain([minP - buffer, maxP + buffer]);
      elements.candles
        .transition()
        .duration(200)
        .attr('y', d => yScale(Math.max(d.open, d.close)))
        .attr('height', d =>
          d.open === d.close
            ? 1
            : yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close))
        );

      elements.stems
        .transition()
        .duration(200)
        .attr('y1', d => yScale(d.high))
        .attr('y2', d => yScale(d.low));
    }
  }

  handleCrosshair(elements) {
    elements.hoverDot.attr('x', -5).attr('y', 0);
    elements.hoverDot2.attr('x', -5).attr('y', 0);
  }
}
