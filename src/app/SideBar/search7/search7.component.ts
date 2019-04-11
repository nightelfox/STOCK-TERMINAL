import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {DbUserWatchlistService} from '../../services/db-user-watchlist.service';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-search7',
  templateUrl: './search7.component.html',
  styleUrls: ['./search7.component.css']
})
export class Search7Component implements OnInit {
  control: FormControl = new FormControl('');
  constructor(private db: DbUserWatchlistService) { }
  searchStock() {
    this.db.searchSymbol = this.control.value.toString().toUpperCase();
  }
  focusState(event) {
    if (event.type === 'input' && this.control.value.toString().length !== 0) {
      this.db.focused = true;
    } else if (this.control.value.toString().length === 0) {
      this.db.focused = false;
    }
    console.log(this.db.focused);
  }
  ngOnInit() {
  }

}
