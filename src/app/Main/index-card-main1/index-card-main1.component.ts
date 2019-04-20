import { Component, OnInit } from '@angular/core';
import { IexFetchingService } from 'src/app/services/iex-fetching.service';

@Component({
  selector: 'app-index-card-main1',
  templateUrl: './index-card-main1.component.html',
  styleUrls: ['./index-card-main1.component.css'],
})
export class IndexCardMain1Component implements OnInit {
  symbol;

  constructor(private chartData: IexFetchingService) {}

  ngOnInit() {
    this.chartData.symbolMonthStats.subscribe(res => {
      this.symbol = res;
    });
  }
}
