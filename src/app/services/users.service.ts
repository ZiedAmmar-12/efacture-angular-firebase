import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { User } from '../models/User.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UsersService {
 
  users: User[] = [];
  userobject: User = new User();
  usersSubject = new Subject<User[]>();

  constructor(public readonly auth: AngularFireAuth, private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage) { }

  emitUsers() {
    this.usersSubject.next(this.users);
  }

  getAlluser(){
    const db = this.firebase.database;

    const query = db.ref().child('users').get().then( (snapshot) => {
      var tablist:any = [];
        snapshot.forEach(childsnapshot => {
          tablist.push(childsnapshot.val());
          this.users = tablist;
          this.emitUsers();
        });
      } 
    );

  } 

  getuserById(id?: string) {
  
    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/users/' +id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }

  getdetailuserById(id?: string) {

    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        console.log('id ::: '+id);
          db.ref('/users/'+id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }
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
    // if user already added by admin , now you need to redirect to home page or ohter page 
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

  
  saveUsers(newUser: User) {
    const keyunique = 'uid-' + this.Randomkeys.createId();
    newUser.id = keyunique;
    const db = this.firebase.database;
    const query = db.ref('/users/'+keyunique).set(newUser);
    this.emitUsers();
  }
  
  async updateUserData(id,userData){
    const db = this.firebase.database;
    await  db.ref('/users/'+id).update(userData);
  }


  removeUser(id) {

    if (confirm('Vous voulez vraiment supprimer les données de cet utilisateur?')) {
      const db = this.firebase.database;
      const query = db.ref('/users/'+id).remove();

      this.emitUsers();
    }
 
  }
 



}


