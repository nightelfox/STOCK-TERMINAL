import { Component, OnInit, Input } from '@angular/core';
import { Stock } from '../../../stock';
import { DbUserWatchlistService } from '../../../services/db-user-watchlist.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-side-bar-list-btn',
  templateUrl: './side-bar-list-btn.component.html',
  styleUrls: ['./side-bar-list-btn.component.css'],
})
export class SideBarListBtnComponent implements OnInit {
  @Input() stock: Stock;
  constructor(private dbUserWatchlist: DbUserWatchlistService, public auth: AuthService) {}
  btnClass(stock: Stock) {
    return this.dbUserWatchlist.userWatchlist.indexOf(stock.symbol) !== -1;
  }
  addToFavorites(stock: Stock): void {
    this.dbUserWatchlist.authorizationCheck(stock.symbol);
  }
  ngOnInit() {}
}
