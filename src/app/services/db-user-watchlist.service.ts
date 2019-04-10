import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {Stock} from '../stock';

@Injectable({
  providedIn: 'root'
})
export class DbUserWatchlistService {
  userWatchlist = [];
  user$: Observable<any>;
  symbols = [];
  userSymbols: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  addToFavorites(symbol: string): void {
    if (this.userWatchlist.indexOf(symbol) === -1) {
      this.userWatchlist.push(symbol);
    } else {
      this.userWatchlist.splice(this.userWatchlist.indexOf(symbol), 1);
    }
    this.userSymbols.next(this.userWatchlist);
  }

  getAuthUser(): Observable<any> {
     return this.afAuth.user.pipe(map(data => {
      const userRef: AngularFirestoreDocument = this.afs.doc(`users/${data.uid}`);
      return userRef;
  }));
}
}


