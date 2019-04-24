import { Injectable } from '@angular/core';
import * as d3 from 'd3';
import { clone } from './utils/d3-chart-utils';

@Injectable({
  providedIn: 'root',
})
export class DivisonService {
  data;
  regionsIds;
  percentRegions;
  percentData;
  constructor() {}

  divide(data) {
    const nestByRegionId = d3
      .nest()
      .key(d => d.regionId)
      .sortKeys((v1, v2) => (parseInt(v1, 10) > parseInt(v2, 10) ? 1 : -1))
      .entries(data.data);

    //console.log(this.regionsNamesById);

    d3.map(data.data, d => d.regionId)
      .keys()
      .forEach((d, i) => {
        data.regions[d] = { data: nestByRegionId[i].values, enabled: true };
      });

    data.regionsIds = Object.keys(data.regions);
    const tempRegion = clone(data.regions[data.regionsIds.length]);

    const zero = tempRegion.data[0].close - 0.001;
    tempRegion.data.forEach(element => {
      element.close = 100 - (zero / element.close) * 100;
      element.date = new Date(element.date);
      data.percentData.push(element);
    });

    data.percentRegions[data.regionsIds.length] = tempRegion;

    this.data = data.data;
    this.percentRegions = data.percentRegions;
    this.regionsIds = data.regionsIds;
    this.percentData = data.percentData;

    //console.log('linearRegions', this.regions);
    //console.log('percentRegions', this.percentRegions);
  }
}
