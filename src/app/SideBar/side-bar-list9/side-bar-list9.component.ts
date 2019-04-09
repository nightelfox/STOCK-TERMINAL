import { Component, OnInit } from '@angular/core';
import { Stock } from '../../stock';
import { IexFetchingService} from '../../services/iex-fetching.service';

import { DbUserWatchlistService } from 'src/app/services/db-user-watchlist.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-side-bar-list9',
  templateUrl: './side-bar-list9.component.html',
  styleUrls: ['./side-bar-list9.component.css'],
  providers: [IexFetchingService]
})
export class SideBarList9Component implements OnInit {

  /*userSymbols = [];*/
  stocks: Stock[];
  selectedStock: Stock;

  constructor(private iexFetchigService: IexFetchingService, private userWatchlist: DbUserWatchlistService, private afAuth: AngularFireAuth, ) { }
  onSelect(stock: Stock, $event): void {
    if ($event.target.tagName !== 'BUTTON') {
      this.selectedStock = stock;
    }
  }
  addToFavorites(stock: Stock): void {
    if (this.iexFetchigService.userSymbols.indexOf(stock) === -1) {
      this.iexFetchigService.userSymbols.push(stock);
    } else {
      this.iexFetchigService.userSymbols.splice(this.iexFetchigService.userSymbols.indexOf(stock),1);
    }
  }
 /* getData () {
    this.iexFetchigService.getDataForSideBar().subscribe(data => {
      this.stocks = data;
    });
  }*/
  ngOnInit() {
    this.iexFetchigService.getDataForSideBar().subscribe(data => {
      this.stocks = data;
    });
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
  }

}
