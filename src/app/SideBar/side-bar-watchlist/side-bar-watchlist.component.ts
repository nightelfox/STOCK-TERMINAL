import { Component, OnInit } from '@angular/core';
import { Stock } from '../../stock';
import { IexFetchingService} from '../../services/iex-fetching.service';
import {DbUserWatchlistService} from '../../services/db-user-watchlist.service';

@Component({
  selector: 'app-side-bar-watchlist',
  templateUrl: './side-bar-watchlist.component.html',
  styleUrls: ['./side-bar-watchlist.component.css']
})
export class SideBarWatchlistComponent implements OnInit {

  constructor(private iexFetchingService: IexFetchingService, private dbUserWatchlist: DbUserWatchlistService,) { }
  stocks: Stock[];
  userSymbols = [];

  addToFavorites(stock: Stock): void {
    this.dbUserWatchlist.addToFavorites(stock.symbol);
    this.dbUserWatchlist.userSymbols.subscribe(data => this.userSymbols = data);
  }

  ngOnInit() {
    this.iexFetchingService.getDataForSideBar().subscribe(data => {
      this.stocks = data;
    });
    this.dbUserWatchlist.userSymbols.subscribe(data => this.userSymbols = data);
  }

}
