import {Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Stock } from '../../stock';
import { ForSideBarService } from '../../services/for-side-bar.service';
import { AuthService } from '../../services/auth.service';
import { IexFetchingService } from '../../services/iex-fetching.service';
import { DbUserWatchlistService } from '../../services/db-user-watchlist.service';
import { first } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-side-bar-list-item',
  templateUrl: './side-bar-list-item.component.html',
  styleUrls: ['./side-bar-list-item.component.css'],
})
export class SideBarListItemComponent implements OnInit, OnDestroy {
  @Input() listState: string;
  stocks: Stock[];
  search: string;
  private id: string;
  private subscription: Subscription = new Subscription();

  constructor(
    private sb: ForSideBarService,
    public auth: AuthService,
    private iexFetchingService: IexFetchingService,
    private dbUserWatchlist: DbUserWatchlistService,
    private activateRoute: ActivatedRoute) {
    this.subscription.add(activateRoute.params.subscribe(params => this.id = params['id']));
  }

  getCompanyInfo() {
    this.subscription.add(this.iexFetchingService.getSymbolMonthStats(this.sb.selectedStock).subscribe((data) => {
      this.iexFetchingService.symbolMonthStats.next(data);
    }));
    this.subscription.add(this.iexFetchingService.getSymbolInfo(this.sb.selectedStock).subscribe((data) => {
      this.iexFetchingService.symbolInfo.next(data);
    }));
    this.subscription.add(this.iexFetchingService.getSymbolNews(this.sb.selectedStock).subscribe((data) => {
      this.iexFetchingService.symbolNews.next(data);
    }));
  }

  onSelect(stock: Stock): void {
    this.sb.onSelect(stock.symbol);
    this.getCompanyInfo();
  }
  lstClass(stock: Stock) {
    return stock.symbol === this.sb.selectedStock;
  }
  hiddenLst(stock) {
    const hiddenCondition = this.sb.focused && stock.symbol.indexOf(this.search) === -1;
    if (this.listState === 'all') {
      return hiddenCondition ;
    }
    return this.dbUserWatchlist.userWatchlist.indexOf(stock.symbol) === -1 || hiddenCondition ;
  }
  ngOnInit() {
    if (this.sb.getLocalStocks()) {
      this.stocks = this.sb.getLocalStocks();
    }
    if (this.dbUserWatchlist.userWatchlist.length === 0) {
      this.subscription
        .add(this.dbUserWatchlist.getDBWatchlist().pipe(first()).subscribe((res) => {
          res
          .collection('watchlist')
          .doc('savedSymbols')
          .get()
          .subscribe((data) => {
            Object.keys(data.data()).forEach((item) => {
              this.dbUserWatchlist.userWatchlist.push(item);
            });
          });
        }));
    }
    this.subscription
      .add(this.iexFetchingService.timerData(this.iexFetchingService.getDataForSideBar(), 30000)
      .subscribe((data) => {
        this.stocks = data;
        this.sb.setLocalStocks(data);
      }));
    this.getCompanyInfo();
    this.subscription.add(this.sb.searchSymbol.subscribe(res => this.search = res));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
