import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import {
    AngularFirestore,
    AngularFirestoreDocument,
} from "@angular/fire/firestore"; 
import firebase from 'firebase/app';
import { Router } from  "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user: any;

  constructor(
    private afAuth: AngularFireAuth, 
    private afs: AngularFirestore) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.user = user;
      }
    });
  }

  FacebookAuth() {
    return this.AuthLogin(new firebase.auth.FacebookAuthProvider());
  }

  AuthLogin(provider) {
    return this.afAuth.signInWithPopup(provider)
    .then((result) => {
        console.log('You have been successfully logged in!')
    }).catch((error) => {
        console.log(error)
    })
  }

  async login(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  async register(email: string, password: string) {
    return await this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((res) => {
        res.user.sendEmailVerification();
        this.addFirstUser(res.user.email, res.user.uid)
      })
  }

  async addFirstUser(email, uid) {
    return await this.afs.collection("users").doc(uid).set({
      email: email,
      isFirstTimeUser: true,
    });
  }

  async sendPasswordResetEmail(email) {
    return this.afAuth.sendPasswordResetEmail(email);
  }

  getUserAuthState() {
    return this.afAuth;
  }
}
