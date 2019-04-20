import { Component, OnInit } from '@angular/core';
import { IexFetchingService } from 'src/app/services/iex-fetching.service';

@Component({
  selector: 'app-indecies-list',
  templateUrl: './indecies-list.component.html',
  styleUrls: ['./indecies-list.component.css'],
})
export class IndeciesListComponent implements OnInit {
  constructor(private chartData: IexFetchingService) {}

  ngOnInit() {}

  sendToCompare(symbol) {
    this.chartData.monthScale.subscribe(res => {
      this.chartData.getChart(symbol, res).subscribe(res => {
        this.chartData.compare.next(res);
      });
    });
  }
}
