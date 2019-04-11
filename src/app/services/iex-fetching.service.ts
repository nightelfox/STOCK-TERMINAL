import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import { initialIndecies } from './initialConfig';
import { map } from 'rxjs/operators';
import {Stock} from '../stock';

@Injectable({
  providedIn: 'root'
})
export class IexFetchingService {

  indecies: string[] = initialIndecies;

  public symbolSource$ = new BehaviorSubject<string>('GOOGL');
  symbolInfo: BehaviorSubject<any> = new BehaviorSubject('');
  // selectedSymSource$: Observable<any> = this.symbolSource$.asObservable();

  changeSymbolSource(newSymbol: string): void {
    this.symbolSource$.next(newSymbol);
  }

  constructor(private http: HttpClient) {}

  getDataForSideBar(): Observable<any> {
    const apiRequest = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${initialIndecies.join(',')}
    &types=quote&range=dynamic&last=5`;
    return this.http.get(apiRequest).pipe(map(data => {
        const stocks = [];
        Object.keys(data).forEach((key, index) => {
          stocks[index] = {
            symbol: data[key].quote.symbol,
            latestPrice: data[key].quote.latestPrice,
            changePercent: (((data[key].quote.latestPrice - data[key].quote.previousClose) / data[key].quote.latestPrice) * 100).toFixed(2),
            state: 'В портфель'
          };
        });
        return stocks;
      })
    );
  }

  getAllIndecies(): Observable<any> {
   return this.http.get('https://api.iextrading.com/1.0/ref-data/symbols')
   .pipe(map(data => {
     const indecies = {};
     Object.keys(data).forEach(key => {
        indecies[data[key].symbol] = data[key].name;
      });
     return indecies;
   })
   );
  }

  getAllSymbolInfo(symbol: string, field: string): Observable<any> {
    return this.http.get(`https://api.iextrading.com/1.0/stock/${symbol}/initial-load?last=3`)
    .pipe(map(data => {
      return data[field];
    })
    );

  }

  getChart(symbol: string, range: string): Observable<any> {
    return this.http.get(`https://api.iextrading.com/1.0/stock/${symbol}/batch?types=chart&range=${range}`)
    .pipe(map(data => {
      return data;
    }));
  }

  getSymbolMonthStats(selectedSymbol: string) {
    return this.http.get(`https://api.iextrading.com/1.0/stock/market/batch?symbols=${selectedSymbol}&types=chart&range=dynamic&last=5`)
      .pipe(map(symbolData => {
        let newSymbolData = symbolData[selectedSymbol]['chart']['data'];
        let indexLastElement = newSymbolData.length - 1;
        return {open: newSymbolData[indexLastElement]['open'],
                    close: newSymbolData[indexLastElement]['close'],
                    preOpen: newSymbolData[indexLastElement - 1]['open'],
                    preClose: newSymbolData[indexLastElement - 1]['close'],
                    min: newSymbolData[indexLastElement]['low'],
                    max: newSymbolData[indexLastElement]['high'],
                    maxMonth: Math.max.apply(Math, newSymbolData.map(obj => obj.high)),
                    minMonth: Math.min.apply(Math, newSymbolData.map(obj => obj.low))}
      }));
  }

}
