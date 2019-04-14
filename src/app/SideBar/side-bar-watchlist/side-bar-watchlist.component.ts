import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-side-bar-watchlist',
  templateUrl: './side-bar-watchlist.component.html',
  styleUrls: ['./side-bar-watchlist.component.css'],
})
export class SideBarWatchlistComponent implements OnInit {
  state: string = 'my';
  constructor() {}
  ngOnInit() {
  }
}
