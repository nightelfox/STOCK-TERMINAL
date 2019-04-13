import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { auth } from 'firebase/app';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { User } from './user.model';
import { DbUserWatchlistService } from './db-user-watchlist.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<User>;
  credential;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private db: DbUserWatchlistService
  ) {
    this.user$ = this.afAuth.authState.pipe(
      switchMap((user) => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        }
        return of(null);
      })
    );
  }

  async googleSignIn() {
    const PROVIDER = new auth.GoogleAuthProvider();
    this.credential = await this.afAuth.auth.signInWithPopup(PROVIDER);
    this.updateUserData(this.credential.user);
    this.db.getAuthUser();
    return this.router.navigate(['/app/all-stocks']);
  }

  async emailSignIn(email, password) {
    this.credential = await this.afAuth.auth.signInWithEmailAndPassword(email, password);
    console.log(this.credential);
    this.db.getAuthUser();
    return this.router.navigate(['/app/all-stocks']);
  }

  async register(email, password, name) {
    const NEW_USER = await this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    this.updateUserData({
      uid: NEW_USER.user.uid,
      email,
      displayName: name,
      photoURL:
        'https://m.media-amazon.com/images/M/MV5BMjIzOTI4MDAzNV5BMl5BanBnXkFtZTcwNDk4MzYxNw@@._V1_UY256_CR4,0,172,256_AL_.jpg',
    });
    console.log(NEW_USER);
  }
  async signOut() {
    await this.afAuth.auth.signOut();
    this.credential = null;
    this.db.user$ = null;
    this.db.userWatchlist = [];
    this.db.clearLocal();
    return this.router.navigate(['/']);
  }

  guestSignIn() {
    return this.router.navigate(['/app/all-stocks']);
  }

  updateUserData({ uid, email, displayName, photoURL }: User) {
    const USER_REF: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);
    const DATA = {
      uid,
      email,
      displayName,
      photoURL,
    };
    const WATCHLIST = {
      AAPL: 14,
      GOOGL: 15,
    };
    USER_REF.set(DATA, { merge: true });
    return USER_REF
      .collection('watchlist')
      .doc('savedSymbols')
      .set(WATCHLIST, { merge: true });
  }
}
