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

  onSelect(stock: Stock, $event): void {
    this.dbUserWatchlist.onSelect(stock.symbol, $event);
  }

  ngOnInit() {
    this.iexFetchingService.getDataForSideBar().subscribe(data => {
      this.stocks = data;
    });
    if (!this.dbUserWatchlist.getLocalData()){
      this.dbUserWatchlist.userSymbols.subscribe(data => {
        this.userSymbols = data;
      });
    } else {
      this.userSymbols = this.dbUserWatchlist.getLocalData();
    }
    // this.userSymbols = this.dbUserWatchlist.getLocalData();
  }

}
