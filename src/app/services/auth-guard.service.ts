import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { CanActivate, Router } from '@angular/router';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/database';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private firebase: AngularFireDatabase ) { }

  canActivate(): Observable<boolean> | Promise<boolean> | boolean{
     return new Promise(
      (resolve, reject) =>{
        firebase.auth().onAuthStateChanged(
          (user: any) =>{
            if(user){
              resolve(true); 
            }else {
              this.router.navigate(['/auth','signin']);
              resolve(false);
            }
          }
        );
      }
     );

  }
}
