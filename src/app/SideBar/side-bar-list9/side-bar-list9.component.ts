import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Stock } from '../../stock';
import { IexFetchingService} from '../../services/iex-fetching.service';
import { DbUserWatchlistService } from 'src/app/services/db-user-watchlist.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import {AuthService} from '../../services/auth.service';
import {ForSideBarService} from '../../services/for-side-bar.service';

@Component({
  selector: 'app-side-bar-list9',
  templateUrl: './side-bar-list9.component.html',
  styleUrls: ['./side-bar-list9.component.css']
})
export class SideBarList9Component implements OnInit {
  stocks: Stock[];
  symbolsFromDb;
  constructor(private sb: ForSideBarService, public auth: AuthService, private iexFetchingService: IexFetchingService,
              private dbUserWatchlist: DbUserWatchlistService, private afAuth: AngularFireAuth) {}

  /*newSymbolSelected(newSymbol): void {
    this.iexFetchingService.changeSymbolSource(newSymbol);
    // this.iexFetchingService.symbolSource$.subscribe(name => this.iexFetchingService.getSymbolMonthStats(name)
    .subscribe(data => console.log(data)));
  }*/
  onSelect(stock: Stock, $event): void {
    this.sb.onSelect(stock.symbol, $event);
    this.iexFetchingService.getSymbolMonthStats(this.sb.selectedStock).subscribe(data => {
      this.iexFetchingService.symbolInfo.next(data);
    });
  }
  addToFavorites(stock: Stock): void {
    this.dbUserWatchlist.addToFavorites(stock.symbol);
  }
  lstClass(stock: Stock) {
    return stock.symbol === this.sb.selectedStock;
  }
  percentColor(stock: Stock) {
   return stock.changePercent > 0 ? 'green' : 'red';
  }
  btnClass(stock: Stock) {
    return this.dbUserWatchlist.userWatchlist.indexOf(stock.symbol) !== -1;
  }
  hiddenLst(stock) {
    return this.sb.focused && stock.symbol.indexOf(this.sb.searchSymbol) === -1;
  }
  ngOnInit() {
    if (this.sb.getLocalStocks()) {
      this.stocks = this.sb.getLocalStocks();
    }
    this.iexFetchingService.getDataForSideBar().subscribe(data => {
        this.stocks = data;
        this.sb.setLocalStocks(data);
    });
    this.dbUserWatchlist.getDBWatchlist().subscribe (res => {
          // this.symbolsFromDb = res.data();
          console.log(res);
    });
  }

}

/*this.iexFetchigService.userSymbol.subscribe(data => {
      this.userSymbols = data;
    });*/
/*this.iexFetchigService.getDataForSideBar().subscribe(data => {


  this.userWatchlist.getAuthUser().subscribe (res => {
    res.collection('watchlist').doc('savedSymbols').valueChanges().subscribe( res => {

      const tempStocks = data;

      // Переделать через filter
      for (const sym in data) {
        for (const saved in res) {
          if (data[sym].symbol === saved) {
            this.userSymbols.push(data[sym]);
            tempStocks.splice(tempStocks.indexOf(data[sym]), 1);
          }
        }
      }

      this.stocks = tempStocks;
      console.log(this.stocks);

    });
  });

});*/
