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
  userSymbols = [];
  user$: Observable<any>;
  symbols = [];
  userSymbol: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  addToFavorites(stock: Stock): void {
    if (this.userSymbols.indexOf(stock) === -1) {
      this.userSymbols.push(stock);
    } else {
      this.userSymbols.splice(this.userSymbols.indexOf(stock), 1);
    }
    console.log(this.userSymbols);
    this.userSymbol.next(this.userSymbols);
  }

  getAuthUser(): Observable<any> {
     return this.afAuth.user.pipe(map(data => {
      const userRef: AngularFirestoreDocument = this.afs.doc(`users/${data.uid}`);
      return userRef;
  }));
}
}


