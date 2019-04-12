import { Injectable, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {Stock} from '../stock';
import { firestore } from 'firebase/app';

const STORAGE_KEY_SELECT = 'local_selected';
const STORAGE_KEY_STOCKS = 'local_stocks';

@Injectable({
  providedIn: 'root'
})
export class ForSideBarService {
  selectedStock: string;
  searchSymbol: string;
  focused: boolean;
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }
  getLocalStocks() {
    return this.storage.get(STORAGE_KEY_STOCKS);
  }
  setLocalStocks(stocks: Stock[]) {
    this.storage.set(STORAGE_KEY_STOCKS, stocks);
    console.log(stocks);
  }
  onSelect(stock: string, event): void {
    console.log(event.target.tagName);
    if (event.target.tagName !== 'BUTTON') {
      this.selectedStock = stock;
    }
    this.storage.set(STORAGE_KEY_SELECT, this.selectedStock);
  }
}
