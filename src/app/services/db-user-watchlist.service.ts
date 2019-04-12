import { Injectable, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import {Stock} from '../stock';
import { firestore } from 'firebase/app';

const STORAGE_KEY_WATCH = 'local_userWatchList';

@Injectable({
  providedIn: 'root'
})

export class DbUserWatchlistService {
  userWatchlist = this.getLocalData() || [];
  user$: Observable<any>;
  symbols = [];
  symbolsFromDb;
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
      // this.getDBWatchlist().subscribe( res => {
      //   for(let i in res){
      //     console.log(i);
      //   }
      // })

      this.getDBWatchlist().subscribe (res => {
        const userRef: AngularFirestoreDocument = this.afs.doc(`users/${res.uid}`);
        userRef.collection('watchlist').doc('savedSymbols').get().subscribe (data => {
         this.symbolsFromDb = data.data();
        })
      });

      this.addSymbolToDBWatchlist(symbol);
      this.userWatchlist.push(symbol);
    } else {
      this.removeSymbolFromDBWatchlist(symbol);
      this.userWatchlist.splice(this.userWatchlist.indexOf(symbol), 1);
    }
    /*this.userSymbols.next(this.userWatchlist);*/
    this.storage.set(STORAGE_KEY_WATCH, this.userWatchlist);
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
    return userRef.collection('watchlist').doc('savedSymbols').set({[symbol]: Math.random()},{merge: true});
    });
}

removeSymbolFromDBWatchlist(symbol) {
  return this.afAuth.user.subscribe (res => {
    const userRef: AngularFirestoreDocument = this.afs.doc(`users/${res.uid}/watchlist/savedSymbols`);
    return userRef.update({[symbol]: firestore.FieldValue.delete()});
  });
}

getDBWatchlist(): Observable<any> {
    return this.afAuth.user.pipe( map(res => {
    return this.afs.doc(`users/${res.uid}`);
  }));
}
}
