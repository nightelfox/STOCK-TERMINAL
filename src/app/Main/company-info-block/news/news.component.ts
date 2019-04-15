import { Component, OnInit } from '@angular/core';
import { News } from './news';
import { IexFetchingService } from '../../../services/iex-fetching.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  news: News[];
  constructor(private iexFetchingService: IexFetchingService) { }

  ngOnInit() {
    this.iexFetchingService.symbolNews.subscribe(res =>{
      this.news = res;
      console.log(res);
    });
  }

}
