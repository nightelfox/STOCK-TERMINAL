import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DbUserWatchlistService {

  user$: Observable<any>;
  symbols = [];

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) { }

  getAuthUser(): Observable<any> {
     return this.afAuth.user.pipe(map(data => {
      const userRef: AngularFirestoreDocument = this.afs.doc(`users/${data.uid}`);
      return userRef;
  }));
}
}


