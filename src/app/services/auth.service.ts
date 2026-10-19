import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from '@firebase/app-compat';
import { getAuth } from 'firebase/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { trace } from '@angular/fire/compat/performance';
import { isPlatformServer } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs-compat';
import { getDatabase } from 'firebase/database';
import { User } from '../models/User.model';
import { Console } from 'console';
import { Firestore, collectionData, collection, addDoc, doc, docData } from '@angular/fire/firestore';
import { inject } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  private firestore: Firestore = inject(Firestore);
  authService: any;

  email = '';
  password = '';
  
  userDisposable: Subscription = new Subscription;
  getData: any;



  constructor(public readonly auth: AngularFireAuth, private firebase: AngularFireDatabase, @Inject(PLATFORM_ID) platformId: object, private HttpService: HttpClient, private afAuth: AngularFireAuth, private db: Firestore) {

    this.firestore = db;

    if (!isPlatformServer(platformId)) {
      this.userDisposable = this.auth.authState.pipe(
        trace('auth'),
        map(u => !!u)
      ).subscribe(isLoggedIn => {

        console.log("isLoggedIn" + isLoggedIn);
      });
    }

  }

  async addUser(userData: any) {
    const usersCollection = collection(this.firestore, 'users');
    await addDoc(usersCollection, userData);
  }



  getuid() {
    const authuid = getAuth();
    const user = authuid.currentUser;
    return (user?.uid);

  }

  getUserGid(uid: string): Observable<number> {
    const userDocRef = doc(this.db, `users/${uid}`);
    return docData(userDocRef).pipe(
      map((user: any) => user?.gid)
    );
  }


  async resetPassword(email: string) {
    const user = await this.auth.sendPasswordResetEmail(email);
  }

 async signInUserGoogle() {
    const user = await this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    this.checkUser(user.user?.email??'')
   
    console.log(user)
    
  }
  async createNewUserWithEmailAndPasswordByAdmin(email:string,password:string){
    const user = await this.auth.createUserWithEmailAndPassword(email,password);
    
  }
//-r

  async createNewUser(email: string, password: string,userName:string) {
    // this methode return created user  on authenficated db  
    console.log("username = ",userName)
    const user = await this.auth.createUserWithEmailAndPassword(email, password)
    this.checkUser(email,userName)
    //TODO 1 you need to create user on authenfication db 
    //TODO 2 you need to save your user credential on real time collections 'Users'
    // PS: U need to check if user already exist or not 
    //        const db = this.firebase.database;

    // funtiction like this db.ref('/users').get(List<>)
    // if user already added by admin , now you need to redirect to home page or ohter page md5
    // if user not exist , now you need to save in the collections 'users' 
    // save user data in 'users' collections 

    /*    
         const newUser = new User(); 
          newUser.id = id;
          newUser.nomdutilisateur = nomdutilisateur;
          newUser.gid = gid;
          newUser.email = email;
          newUser.etat = this.etat;
          newUser.adresse = adresse; 
          newUser.uid  = 'uid-keyunique ' + );
    ;
          newUser.datecreation = datecreation; 
          newUser.datemodification = datemodification;
          */
    // const newUser = 
    //     const query = db.ref('/users/'+keyunique).set(newUser);

    // in this step user not actif message page blanc .... 

  }

  // check user in real time 
async checkUser(email: string ,userName?:string) {
    const db = this.firebase.database
    const query = db.ref().child('/users').orderByChild('email').equalTo(email).once('value').then((data) => {
      if (data.exists())
        console.log('user exist  ', data.val())
      else
        this.saveUser(email,userName)

    })
  }
  async saveUser(email: string,userName?:string) {
    const db = this.firebase.database
    const newUser = new User()
    const keyunique = 'uid-' + this.firebase.createPushId()
    newUser.id = keyunique
    
    newUser.email = email
    newUser.etat = false
    newUser.gid = 23
    newUser.nomdutilisateur = userName?? email.substring(0, email.indexOf('@'))
    newUser.email = email
    newUser.telephone = ''
    newUser.datecreation = Date.now()
    newUser.datemodification = Date.now()
    const query = db.ref('/users/' + keyunique).set(newUser)

  }


  async signInUserwithLoginpassword(email: string, password: string) {
    const db = this.firebase.database

    const user = await this.auth.signInWithEmailAndPassword(email, password);
 

  }

  async fetchUserStatus(email:string){
    const db = this.firebase.database
   const userStatus=   await db.ref().child('/users').orderByChild('email').equalTo(email).once('value').then((data) => {
          if (data.exists()) {
        var user
        // get value of etat 
        //go through each item found and print out the emails
        data.forEach(function (childSnapshot) {

          var key = childSnapshot.key
           user = childSnapshot.val()

          //this will be the actual email value found
          console.log( " userstatus from user.etat",user.etat)

        });      
        return user.etat ? true : false

      } else
      return false

    })
    console.log( " user status promise",userStatus) 
    return userStatus
  }

  signOutUser() {
    firebase.auth().signOut();
  }

}
