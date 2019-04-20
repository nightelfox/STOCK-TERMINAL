import { Component, OnInit } from '@angular/core';
import { IexFetchingService } from '../../services/iex-fetching.service';

@Component({
  selector: 'app-company-info-block',
  templateUrl: './company-info-block.component.html',
  styleUrls: ['./company-info-block.component.css']})

export class CompanyInfoBlockComponent implements OnInit {
  buttonStatus = 'indicators';
  constructor() { }
  getButtonStatus($event): void {
    this.buttonStatus = $event;
  }
  ngOnInit() {
  }

}
