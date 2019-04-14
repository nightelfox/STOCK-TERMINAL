import { Component, OnInit, Input } from '@angular/core';
import { CompanyInfo } from './company-info';
import { IexFetchingService } from '../../services/iex-fetching.service';

@Component({
  selector: 'app-about-company',
  templateUrl: './about-company.component.html',
  styleUrls: ['./about-company.component.css']
})
export class AboutCompanyComponent implements OnInit {
  info: CompanyInfo;
  constructor(private iexFetchingService: IexFetchingService) { }

  ngOnInit() {
    this.iexFetchingService.symbolInfo.subscribe(res =>
    this.info = res);
  }

}
