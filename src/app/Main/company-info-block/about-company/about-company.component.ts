import { Component, OnDestroy, OnInit } from '@angular/core';
import { CompanyInfo } from './company-info';
import { IexFetchingService } from '../../../services/iex-fetching.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']})

export class AboutCompanyComponent implements OnInit, OnDestroy {
  info: CompanyInfo;
  private subscription: Subscription = new Subscription();
  constructor(private iexFetchingService: IexFetchingService) { }

  ngOnInit() {
    this.subscription = this.iexFetchingService.symbolInfo.subscribe(res =>
    this.info = res);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
