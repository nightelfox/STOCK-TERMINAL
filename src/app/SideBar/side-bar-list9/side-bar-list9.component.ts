import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-side-bar-list9',
  templateUrl: './side-bar-list9.component.html',
  styleUrls: ['./side-bar-list9.component.css'],
})
export class SideBarList9Component implements OnInit {
  state: string = 'all';
  constructor(
    public auth: AuthService
  ) {}

  ngOnInit() {
  }
}

/*newSymbolSelected(newSymbol): void {
  this.iexFetchingService.changeSymbolSource(newSymbol);
  // this.iexFetchingService.symbolSource$.subscribe(name =>
  this.iexFetchingService.getSymbolMonthStats(name)
  .subscribe(data => console.log(data)));
}*/
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
