import { Injectable, Inject } from '@angular/core';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Stock } from '../stock';
import { Subject } from 'rxjs';

const STORAGE_KEY_SELECT = 'local_selected';
const STORAGE_KEY_STOCKS = 'local_stocks';

@Injectable({
  providedIn: 'root',
})
export class ForSideBarService {
  selectedStock: string = 'GOOGL';
  searchSymbol: Subject<any> = new Subject;
  focused: boolean;
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) {}
  getLocalStocks() {
    return this.storage.get(STORAGE_KEY_STOCKS);
  }
  setLocalStocks(stocks: Stock[]) {
    this.storage.set(STORAGE_KEY_STOCKS, stocks);
  }
  onSelect(stock: string, event): void {
    if (event.target.tagName !== 'path' && event.target.tagName !== 'svg') {
      this.selectedStock = stock;
    }
    this.storage.set(STORAGE_KEY_SELECT, this.selectedStock);
  }
}
