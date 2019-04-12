import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {DbUserWatchlistService} from '../../services/db-user-watchlist.service';
import {BehaviorSubject} from 'rxjs';
import {ForSideBarService} from '../../services/for-side-bar.service';

@Component({
  selector: 'app-search7',
  templateUrl: './search7.component.html',
  styleUrls: ['./search7.component.css']
})
export class Search7Component implements OnInit {
  control: FormControl = new FormControl('');
  constructor(private sb: ForSideBarService) { }
  searchStock() {
    this.sb.searchSymbol = this.control.value.toString().toUpperCase();
  }
  focusState(event) {
    if (event.type === 'input' && this.control.value.toString().length !== 0) {
      this.sb.focused = true;
    } else if (this.control.value.toString().length === 0) {
      this.sb.focused = false;
    }
    console.log(this.sb.focused);
  }
  ngOnInit() {
  }

}
