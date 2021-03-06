import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Stock } from '../stock';
import { Subject } from 'rxjs';
import {Router} from '@angular/router';

const STORAGE_KEY_SELECT = 'local_selected';
const STORAGE_KEY_STOCKS = 'local_stocks';

@Injectable({
  providedIn: 'root',
})
export class ForSideBarService {
  selectedStock: string = 'GOOGL';
  searchSymbol: Subject<any> = new Subject;
  focused: boolean;
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private router: Router) {}
  getLocalStocks() {
    return this.storage.get(STORAGE_KEY_STOCKS);
  }
  setLocalStocks(stocks: Stock[]) {
    this.storage.set(STORAGE_KEY_STOCKS, stocks);
  }
  onSelect(stock: string): void {
    this.selectedStock = stock;
    // this.storage.set(STORAGE_KEY_SELECT, this.selectedStock);
  }
}
