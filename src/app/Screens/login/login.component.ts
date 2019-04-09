import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public auth: AuthService, private router: Router ) {
  }

  ngOnInit() {
    // console.log(this.auth.credential);
    // if(this.auth.credential) {
    //   console.log(this.auth.credential);
    //   this.router.navigate(['/app'])
    // }

  }



}
