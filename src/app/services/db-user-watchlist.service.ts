import { Injectable, Inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import {BehaviorSubject, Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

const STORAGE_KEY = 'local_userWatchList';

@Injectable({
  providedIn: 'root'
})

export class DbUserWatchlistService {
  userWatchlist = this.getLocalData() || [];
  user$: Observable<any>;
  symbols = [];
  userSymbols: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService, private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  getLocalData() {
    return this.storage.get(STORAGE_KEY);
  }
  addToFavorites(symbol: string): void {
    if (this.userWatchlist.indexOf(symbol) === -1) {
      this.userWatchlist.push(symbol);
    } else {
      this.userWatchlist.splice(this.userWatchlist.indexOf(symbol), 1);
    }
    this.userSymbols.next(this.userWatchlist);
    this.storage.set(STORAGE_KEY, this.userWatchlist);
  }

  getAuthUser(): Observable<any> {
     return this.afAuth.user.pipe(map(data => {
      const userRef: AngularFirestoreDocument = this.afs.doc(`users/${data.uid}`);
      return userRef;
  }));
}
}


