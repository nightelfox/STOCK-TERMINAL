import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-bar-tabs8',
  templateUrl: './side-bar-tabs8.component.html',
  styleUrls: ['./side-bar-tabs8.component.css'],
})
export class SideBarTabs8Component implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
