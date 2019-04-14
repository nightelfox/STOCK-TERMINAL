import * as d3 from 'd3';

const margin = { top: 0, right: 20, bottom: 50, left: 50 };
const width = 920 - margin.left - margin.right;
const height = 390 - margin.top - margin.bottom;
const colorScale = d3.scaleOrdinal(d3.schemeCategory20);

export function buildAxis() {
  const x = d3.scaleTime().range([0, width]);
  const y = d3.scaleLinear().range([height, 0]);

  const svg = d3
    .select(this.chartElement.nativeElement)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);
}
