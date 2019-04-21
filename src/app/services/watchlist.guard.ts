import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {first} from 'rxjs/operators';
import {AngularFireAuth} from '@angular/fire/auth';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WatchlistGuard implements CanActivate {

  constructor(private afAuth: AngularFireAuth,
              private router: Router,
              private auth: AuthService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) : Observable<boolean> | boolean {
    if (this.auth.credential === null) {
      this.router.navigate(['/']);
      return false;
    }
    return true;
  }
}
