import { Component, OnInit } from '@angular/core';
import { IexFetchingService } from 'src/app/services/iex-fetching.service';

@Component({
  selector: 'app-scale-select3',
  templateUrl: './scale-select3.component.html',
  styleUrls: ['./scale-select3.component.css'],
})
export class ScaleSelect3Component implements OnInit {
  constructor(private iexFetchingService: IexFetchingService) {}

  ngOnInit() {}

  changeScale(range) {
    this.iexFetchingService.monthScale.next(range);
  }
}
