import { Component, OnInit } from '@angular/core';
import { ChartTypeService } from 'src/app/services/chart-type.service';

@Component({
  selector: 'app-chart-type',
  templateUrl: './chart-type.component.html',
  styleUrls: ['./chart-type.component.css'],
})
export class ChartTypeComponent implements OnInit {
  constructor(private typeService: ChartTypeService) {}

  ngOnInit() {}

  setChartType(chartType: string) {
    this.typeService.chartType.next(chartType);
  }
}
