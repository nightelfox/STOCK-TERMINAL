import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-side-bar-list9',
  templateUrl: './side-bar-list9.component.html',
  styleUrls: ['./side-bar-list9.component.css'],
})
export class SideBarList9Component implements OnInit {
  state: string = 'all';
  constructor(public auth: AuthService) {}

  ngOnInit() {}
}
