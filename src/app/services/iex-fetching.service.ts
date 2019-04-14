import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { initialIndecies } from './initialConfig';
import { map } from 'rxjs/operators';
import { Stock } from '../stock';

@Injectable({
  providedIn: 'root',
})
export class IexFetchingService {
  indecies: string[] = initialIndecies;

  public symbolSource$ = new BehaviorSubject<string>('GOOGL');
  symbolMonthStats: BehaviorSubject<any> = new BehaviorSubject('');
  symbolInfo: BehaviorSubject<any> = new BehaviorSubject('');
  // selectedSymSource$: Observable<any> = this.symbolSource$.asObservable();

  changeSymbolSource(newSymbol: string): void {
    this.symbolSource$.next(newSymbol);
  }

  constructor(private http: HttpClient) {}

  getDataForSideBar(): Observable<any> {
    const API_REQUEST = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${initialIndecies.join(
      ','
    )}
    &types=quote&range=dynamic&last=5`;
    return this.http.get(API_REQUEST).pipe(
      map(data => {
        const STOCKS = [];
        Object.keys(data).forEach((key, index) => {
          STOCKS[index] = {
            symbol: data[key].quote.symbol,
            latestPrice: data[key].quote.latestPrice,
            changePercent: (data[key].quote.changePercent * 100).toFixed(3),
            /*(
              ((data[key].quote.latestPrice - data[key].quote.previousClose) /
                data[key].quote.latestPrice) *
              100
            ).toFixed(2)*/
          };
        });
        return STOCKS;
      })
    );
  }

  getAllIndecies(): Observable<any> {
    return this.http.get('https://api.iextrading.com/1.0/ref-data/symbols').pipe(
      map(data => {
        const INDECIES = {};
        Object.keys(data).forEach(key => {
          INDECIES[data[key].symbol] = data[key].name;
        });
        return INDECIES;
      }),
    );
  }

  getAllSymbolInfo(symbol: string, field: string): Observable<any> {
    return this.http.get(`https://api.iextrading.com/1.0/stock/${symbol}/initial-load?last=3`).pipe(
      map(data => {
        return data[field];
      })
    );
  }

  getChart(symbol: string, range: string): Observable<any> {
    return this.http
      .get(`https://api.iextrading.com/1.0/stock/${symbol}/batch?types=chart&range=${range}`)
      .pipe(
        map(data => {
          return data;
        })
      );
  }

  getDefaultYAxis(symbol: string): Observable<any> {
    return this.http.get(`https://api.iextrading.com/1.0/stock/${symbol}/chart/date/20190129`).pipe(
      map(data => {
        return data;
      })
    );
  }

  getSymbolMonthStats(selectedSymbol: string) {
    return this.http
      .get(
        `https://api.iextrading.com/1.0/stock/market/batch?symbols=${selectedSymbol}&types=chart&range=dynamic&last=5`
      )
      .pipe(
        map(symbolData => {
          const NEW_SYMBOL_DATA = symbolData[selectedSymbol].chart.data;
          const INDEX_LAST_ELEMENT = NEW_SYMBOL_DATA.length - 1;
          return {
            symbol: selectedSymbol,
            open: NEW_SYMBOL_DATA[INDEX_LAST_ELEMENT].open,
            close: NEW_SYMBOL_DATA[INDEX_LAST_ELEMENT].close,
            preOpen: NEW_SYMBOL_DATA[INDEX_LAST_ELEMENT - 1].open,
            preClose: NEW_SYMBOL_DATA[INDEX_LAST_ELEMENT - 1].close,
            min: NEW_SYMBOL_DATA[INDEX_LAST_ELEMENT].low,
            max: NEW_SYMBOL_DATA[INDEX_LAST_ELEMENT].high,
            maxMonth: Math.max.apply(Math, NEW_SYMBOL_DATA.map(obj => obj.high)),
            minMonth: Math.min.apply(Math, NEW_SYMBOL_DATA.map(obj => obj.low)),
            changePercent: NEW_SYMBOL_DATA[INDEX_LAST_ELEMENT].changePercent + '%',
          };
        })
      );
  }

  getSymbolInfo(selectedSymbol: string) {
    return this.http
      .get(
        `https://api.iextrading.com/1.0/stock/market/batch?symbols=${selectedSymbol}&types=company,quote,news&range=dynamic&last=5`
      )
      .pipe(
        map(data => {
          const NEW_SYMBOL_DATA = data[selectedSymbol].company;
          return {
            description: NEW_SYMBOL_DATA.description,
            website: NEW_SYMBOL_DATA.website,
            exchange: NEW_SYMBOL_DATA.exchange,
            marketCap: (data[selectedSymbol].quote.marketCap / 1000000000).toFixed(2),
            sector: NEW_SYMBOL_DATA.sector,
            industry: NEW_SYMBOL_DATA.industry,
          };
        })
      );
  }
  
}
