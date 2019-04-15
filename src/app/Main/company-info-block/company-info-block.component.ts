import { Component, OnInit } from '@angular/core';
import { Indicators } from './indicators/indicatorObject';
import { IexFetchingService } from '../../services/iex-fetching.service';

@Component({
  selector: 'app-company-info-block',
  templateUrl: './company-info-block.component.html',
  styleUrls: ['./company-info-block.component.css']
})
export class CompanyInfoBlockComponent implements OnInit {
  buttonStatus = 'indicators';
  monthIndicator: Indicators;
  constructor(private iexFetchingService: IexFetchingService) { }
  getButtonStatus($event): void {
    this.buttonStatus = $event;
  }
  ngOnInit() {
/*    this.iexFetchingService.symbolInfo.subscribe(data => {
      this.monthIndicator = data;
    });*/
  }

}
