import { Component, OnInit, Input } from '@angular/core';
import { Stock } from '../../../stock';
import { DbUserWatchlistService } from '../../../services/db-user-watchlist.service';
import { AuthService } from '../../../services/auth.service';
import { first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-bar-list-btn',
  templateUrl: './side-bar-list-btn.component.html',
  styleUrls: ['./side-bar-list-btn.component.css']})

export class SideBarListBtnComponent implements OnInit {
  @Input() stock: Stock;
  constructor(
    private dbUserWatchlist: DbUserWatchlistService,
    public auth: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router) { }

  btnClass(stock: Stock) {
    return this.dbUserWatchlist.userWatchlist.indexOf(stock.symbol) !== -1;
  }
  addToFavorites(stock: Stock): void {
    this.authorizationCheck(stock.symbol);
  }
  authorizationCheck(symbol: string): void {
    if (this.auth.credential === null) {
      this.router.navigate(['/']);
    } else {
      this.dbUserWatchlist.addToFavorites(symbol);
    }
  }
  ngOnInit() {
  }

}
