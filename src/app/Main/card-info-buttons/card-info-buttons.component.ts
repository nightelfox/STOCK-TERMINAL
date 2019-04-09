import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-card-info-buttons',
  templateUrl: './card-info-buttons.component.html',
  styleUrls: ['./card-info-buttons.component.css']
})
export class CardInfoButtonsComponent implements OnInit {

  constructor() { }

  selectedTabStatus: string = 'indicators';
  @Output() buttonStatusEvent = new EventEmitter<string>();
  sendButtonStatus(status: string): void {
    this.buttonStatusEvent.emit(status);
  }

  ngOnInit() {
  }

}
