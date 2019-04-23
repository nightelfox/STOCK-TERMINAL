import { Component, OnDestroy, OnInit } from '@angular/core';
import { IexFetchingService } from '../../../services/iex-fetching.service';
import { Indicators } from './indicatorObject';
import { DbUserWatchlistService } from '../../../services/db-user-watchlist.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.css'],
})
export class IndicatorsComponent implements OnInit {
  monthIndicator = {} as Indicators;
  private subscription: Subscription = new Subscription();
  constructor(private iexFetchingService: IexFetchingService) {}

  ngOnInit() {
    this.subscription = this.iexFetchingService.symbolMonthStats.subscribe(data => {
      this.monthIndicator = data;
    });
  }
}
