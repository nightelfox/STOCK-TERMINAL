import { Component, OnInit, Input } from '@angular/core';
import { Stock } from '../../stock';
import { ForSideBarService } from '../../services/for-side-bar.service';
import { AuthService } from '../../services/auth.service';
import { IexFetchingService } from '../../services/iex-fetching.service';
import { DbUserWatchlistService } from '../../services/db-user-watchlist.service';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar-list-item',
  templateUrl: './side-bar-list-item.component.html',
  styleUrls: ['./side-bar-list-item.component.css'],
})
export class SideBarListItemComponent implements OnInit {
  @Input() listState: string;
  stocks: Stock[];
  constructor(
    private sb: ForSideBarService,
    public auth: AuthService,
    private iexFetchingService: IexFetchingService,
    private dbUserWatchlist: DbUserWatchlistService
  ) {}
  /* onSelect(stock: Stock, $event): void {
    this.sb.onSelect(stock.symbol, $event);
    this.iexFetchingService
      .getSymbolMonthStats(this.sb.selectedStock, 'dynamic')
      .subscribe(data => {
        this.iexFetchingService.symbolMonthStats.next(data);
      });
  }*/
  getCompanyInfo() {
    this.iexFetchingService
      .getSymbolMonthStats(this.sb.selectedStock, 'dynamic')
      .subscribe(data => {
        this.iexFetchingService.symbolMonthStats.next(data);
      });
    this.iexFetchingService.getSymbolInfo(this.sb.selectedStock).subscribe(data => {
      this.iexFetchingService.symbolInfo.next(data);
    });
    this.iexFetchingService.getSymbolNews(this.sb.selectedStock).subscribe(data => {
      this.iexFetchingService.symbolNews.next(data);
    });
  }

  onSelect(stock: Stock, $event): void {
    this.sb.onSelect(stock.symbol, $event);
    this.getCompanyInfo();
  }
  lstClass(stock: Stock) {
    return stock.symbol === this.sb.selectedStock;
  }
  hiddenLst(stock) {
    const HIDDEN_CONDITION = this.sb.focused && stock.symbol.indexOf(this.sb.searchSymbol) === -1;
    if (this.listState === 'all') {
      return HIDDEN_CONDITION;
    }
    return this.dbUserWatchlist.userWatchlist.indexOf(stock.symbol) === -1 || HIDDEN_CONDITION;
  }
  ngOnInit() {
    if (this.sb.getLocalStocks()) {
      this.stocks = this.sb.getLocalStocks();
    }
    this.iexFetchingService
      .timerData(this.iexFetchingService.getDataForSideBar(), 9000)
      .subscribe(data => {
        this.stocks = data;
        this.sb.setLocalStocks(data);
      });
    this.getCompanyInfo();
  }
}
