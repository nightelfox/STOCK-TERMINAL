import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { initialIndecies } from './initialConfig';
import { map, switchMap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class IexFetchingService {
  symbolMonthStats: BehaviorSubject<any> = new BehaviorSubject('');
  monthScale: BehaviorSubject<any> = new BehaviorSubject('1m');
  compare: BehaviorSubject<any> = new BehaviorSubject('');
  symbolInfo: BehaviorSubject<any> = new BehaviorSubject('');
  symbolNews: BehaviorSubject<any> = new BehaviorSubject('');

  constructor(private http: HttpClient) {}

  timerData(func, time): Observable<any> {
    return timer(0, time).pipe(
      take(10),
      switchMap(() => func));
  }

  getDataForSideBar(): Observable<any> {
    const apiRequest = `https://api.iextrading.com/1.0/stock/market/batch?symbols=${initialIndecies.join(',')}&types=quote&range=dynamic&last=5`;
    return this.http.get(apiRequest).pipe(
      map((data) => {
        const stocks = [];
        Object.keys(data).forEach((key, index) => {
          stocks[index] = {
            symbol: data[key].quote.symbol,
            latestPrice: data[key].quote.latestPrice,
            changePercent: (data[key].quote.changePercent * 100).toFixed(3),
          };
        });
        return stocks;
      }));
  }

  getChart(symbol: string, range: string): Observable<any> {
    return this.http
      .get(`https://api.iextrading.com/1.0/stock/${symbol}/batch?types=chart&range=${range}`)
      .pipe(
        map((data) => {
          return data;
        }));
  }

  getSymbolMonthStats(selectedSymbol: string) {
    return this.http
      .get(
        `https://api.iextrading.com/1.0/stock/market/batch?symbols=${selectedSymbol}&types=chart&range=dynamic&last=5`)
      .pipe(
        map((symbolData) => {
          const newSymbolData = symbolData[selectedSymbol].chart.data;
          const indexLastElement = newSymbolData.length - 1;
          return {
            symbol: selectedSymbol,
            open: newSymbolData[indexLastElement].open,
            close: newSymbolData[indexLastElement].close,
            preOpen: newSymbolData[indexLastElement - 1].open,
            preClose: newSymbolData[indexLastElement - 1].close,
            min: newSymbolData[indexLastElement].low,
            max: newSymbolData[indexLastElement].high,
            maxMonth: Math.max.apply(Math, newSymbolData.map(obj => obj.high)),
            minMonth: Math.min.apply(Math, newSymbolData.map(obj => obj.low)),
            changePercent: `${newSymbolData[indexLastElement].changePercent}%`,
          };
        }));
  }

  getSymbolInfo(selectedSymbol: string) {
    return this.http
      .get(
        `https://api.iextrading.com/1.0/stock/market/batch?symbols=${selectedSymbol}&types=company,quote`)
      .pipe(
        map((data) => {
          const NEW_SYMBOL_DATA = data[selectedSymbol].company;
          return {
            description: NEW_SYMBOL_DATA.description,
            website: NEW_SYMBOL_DATA.website,
            exchange: NEW_SYMBOL_DATA.exchange,
            marketCap: (data[selectedSymbol].quote.marketCap / 1000000000).toFixed(2),
            sector: NEW_SYMBOL_DATA.sector,
            industry: NEW_SYMBOL_DATA.industry,
          };
        }));
  }
  getSymbolNews(selectedSymbol: string) {
    return this.http
      .get(
        `https://cloud.iexapis.com/beta/stock/market/batch?token=pk_1794c193ca8f48c2977eca28e92a9023&symbols=${selectedSymbol}&types=news`)
      .pipe(
        map((data) => {
          const NEWS = [];
          data[selectedSymbol].news.forEach((item, index) => {
            NEWS[index] = {
              datetime: new Date(item.datetime).toLocaleString('ru'),
              headline: item.headline,
              url: item.url,
              summary: `${item.summary.substr(0, 300)}...`,
              image: item.image,
              source: item.source,
            };
          });
          return NEWS;
        }));
  }
  // getDefaultYAxis(symbol: string): Observable<any> {
  //   return this.http.get(`https://api.iextrading.com/1.0/stock/${symbol}/chart/date/20190129`).pipe(
  //     map((data) => {
  //       return data;
  //     }));
  // }
  // getAllsymbolMonthStats(symbol: string, field: string): Observable<any> {
  //   return this.http.get(`https://api.iextrading.com/1.0/stock/${symbol}/initial-load?last=3`).pipe(
  //     map((data) => {
  //       return data[field];
  //     }));
  // }
  // getAllIndecies(): Observable<any> {
  //   return this.http.get('https://api.iextrading.com/1.0/ref-data/symbols').pipe(
  //     map((data) => {
  //       const indecies = {};
  //       Object.keys(data).forEach((key) => {
  //         indecies[data[key].symbol] = data[key].name;
  //       });
  //       return indecies;
  //     }));
  // }
}


