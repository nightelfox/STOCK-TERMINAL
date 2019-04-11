import { Injectable, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {Stock} from '../stock';
import { firestore } from 'firebase/app';

const STORAGE_KEY_WATCH = 'local_userWatchList';
/*const STORAGE_KEY_SELECT = 'local_selected';*/

@Injectable({
  providedIn: 'root'
})

export class DbUserWatchlistService {
  userWatchlist = this.getLocalData() || [];
  selectedStock: string;
  searchSymbol: string;
  focused: boolean;
  user$: Observable<any>;
  symbols = [];
  /*userSymbols: BehaviorSubject<any> = new BehaviorSubject([]);
  selected: BehaviorSubject<any> = new BehaviorSubject('');*/
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private afs: AngularFirestore, private afAuth: AngularFireAuth) { }
  clearLocal() {
    this.storage.remove(STORAGE_KEY_WATCH);
  }
  getLocalData() {
    return this.storage.get(STORAGE_KEY_WATCH);
  }

  addToFavorites(symbol: string): void {
    if (this.userWatchlist.indexOf(symbol) === -1) {
      this.addSymbolToDBWatchlist(symbol);
      this.userWatchlist.push(symbol);
    } else {
      this.removeSymbolFromDBWatchlist(symbol);
      this.userWatchlist.splice(this.userWatchlist.indexOf(symbol), 1);
    }
    /*this.userSymbols.next(this.userWatchlist);*/
    this.storage.set(STORAGE_KEY_WATCH, this.userWatchlist);
  }

  onSelect(stock: string, event): void {
    if (event.target.tagName !== 'BUTTON') {
      this.selectedStock = stock;
      console.log(this.selectedStock);
    }
    /*this.storage.set(STORAGE_KEY_SELECT, this.selectedStock);*/
  }

  getAuthUser(): Observable<any> {
     return this.afAuth.user.pipe(map(data => {
      const userRef: AngularFirestoreDocument = this.afs.doc(`users/${data.uid}`);
      return userRef;
  }));
}

addSymbolToDBWatchlist(symbol) {
  return this.afAuth.user.subscribe( res => {
    const userRef: AngularFirestoreDocument = this.afs.doc(`users/${res.uid}`);
      return userRef.collection('watchlist').doc('savedSymbols').set({[symbol]:Math.random()},{merge:true});
    }); 
}

removeSymbolFromDBWatchlist(symbol) {
  return this.afAuth.user.subscribe (res => {
    const userRef: AngularFirestoreDocument = this.afs.doc(`users/${res.uid}/watchlist/savedSymbols`);
    return userRef.update({[symbol]:firestore.FieldValue.delete()});
  })
}
}


