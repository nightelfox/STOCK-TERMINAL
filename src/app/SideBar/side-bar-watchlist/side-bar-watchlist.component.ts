import { Component, OnInit } from '@angular/core';
import { Stock } from '../../stock';
import { IexFetchingService } from '../../services/iex-fetching.service';
import { DbUserWatchlistService } from '../../services/db-user-watchlist.service';
import { ForSideBarService } from '../../services/for-side-bar.service';

@Component({
  selector: 'app-side-bar-watchlist',
  templateUrl: './side-bar-watchlist.component.html',
  styleUrls: ['./side-bar-watchlist.component.css'],
})
export class SideBarWatchlistComponent implements OnInit {
  constructor(
    private sb: ForSideBarService,
    private iexFetchingService: IexFetchingService,
    private db: DbUserWatchlistService
  ) {}
  stocks: Stock[];
  userSymbols = [];

  addToFavorites(stock: Stock): void {
    this.db.addToFavorites(stock.symbol);
    /*this.dbUserWatchlist.userSymbols.subscribe(data => this.userSymbols = data);*/
  }

  onSelect(stock: Stock, $event): void {
    this.sb.onSelect(stock.symbol, $event);
  }
  lstClass(stock: Stock) {
    return stock.symbol === this.sb.selectedStock;
  }
  percentColor(stock: Stock) {
    return stock.changePercent > 0 ? 'green' : 'red';
  }
  hiddenLst(stock: Stock) {
    return (
      this.db.userWatchlist.indexOf(stock.symbol) === -1 ||
      (this.sb.focused && stock.symbol.indexOf(this.sb.searchSymbol) === -1)
    );
  }
  ngOnInit() {
    if (this.sb.getLocalStocks()) {
      this.stocks = this.sb.getLocalStocks();
    }
    this.iexFetchingService.getDataForSideBar().subscribe(data => {
      this.stocks = data;
      this.sb.setLocalStocks(data);
    });
    /*if (!this.dbUserWatchlist.getLocalData()){
      this.dbUserWatchlist.userSymbols.subscribe(data => {
        this.userSymbols = data;
      });
    } else {
      this.userSymbols = this.dbUserWatchlist.getLocalData();
    }*/
    // this.userSymbols = this.dbUserWatchlist.getLocalData();
  }
}
