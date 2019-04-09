import { Component, OnInit } from '@angular/core';
import { Stock } from '../../stock';
import { IexFetchingService} from '../../services/iex-fetching.service';

@Component({
  selector: 'app-side-bar-watchlist',
  templateUrl: './side-bar-watchlist.component.html',
  styleUrls: ['./side-bar-watchlist.component.css']
})
export class SideBarWatchlistComponent implements OnInit {

  constructor(private iexFetchigService: IexFetchingService) { }
  stocks: Stock[];
  ngOnInit() {
    this.stocks = this.iexFetchigService.userSymbols;
    console.log(this.iexFetchigService.userSymbols);
  }

}
