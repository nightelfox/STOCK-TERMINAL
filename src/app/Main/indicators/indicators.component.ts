import { Component, OnInit } from '@angular/core';
import {IexFetchingService} from "../../services/iex-fetching.service";
import {Indicators} from "./indicatorObject";
import {DbUserWatchlistService} from '../../services/db-user-watchlist.service';

@Component({
  selector: 'app-indicators',
  templateUrl: './indicators.component.html',
  styleUrls: ['./indicators.component.css']
})
export class IndicatorsComponent implements OnInit {

  constructor(private iexFetchingService: IexFetchingService, private dbUserWatchlist: DbUserWatchlistService) { }

  selectedSymbol: string;
  monthIndicator = {} as Indicators;

  ngOnInit() {
    this.iexFetchingService.symbolSource$.subscribe((symbol) => {
      this.iexFetchingService.getSymbolMonthStats(symbol).subscribe(data => this.monthIndicator = data);
      console.log(symbol);
    });
  }
}
