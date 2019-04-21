import {Component, OnDestroy, OnInit} from '@angular/core';
import { News } from './news';
import { IexFetchingService } from '../../../services/iex-fetching.service';
import {Subject} from 'rxjs';
import { takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit, OnDestroy {
  news: News[];
  constructor(private iexFetchingService: IexFetchingService) { }
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  ngOnInit() {
    this.iexFetchingService.symbolNews.pipe(takeUntil(this.ngUnsubscribe)).subscribe((res) => {
      this.news = res;
    });
  }
  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
