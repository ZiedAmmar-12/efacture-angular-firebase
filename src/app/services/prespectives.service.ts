import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Subject } from 'rxjs';
import { Prespective } from '../models/Prespective.model';


@Injectable({
  providedIn: 'root'
})
export class PrespectivesService {
  prespectives: Prespective[] = [];
  prespectivesobject: Prespective = new Prespective();
  prespectivesSubject = new Subject<Prespective[]>();
  datacategorie: any;
  categories:any;
 
   constructor(private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage) { }
 
   emitPrestations() {
     this.prespectivesSubject.next(this.prespectives);
   }
   getAllcategorie(){

    let datacategorie:any;
    const db = this.firebase.database;
    var tablistcategorie:any = [];
    return new Promise(

      (resolve, reject) => {
       
        const query3 = db.ref().child('categories').once('value').then(

        (snapshotcategorie) => {
            
          snapshotcategorie.forEach(childsnapshotcategorie => {
            tablistcategorie.push(childsnapshotcategorie.val());
            datacategorie=childsnapshotcategorie.val();
            
          });

          this.categories = tablistcategorie;
          
          
          resolve(this.categories);
        }, (error: any) => {
          reject(error);
        }
      );
    }
  );                    
  }
  
  getnomcategorie(id: string) {
    
    let datacategorie1:any;
    const db = this.firebase.database;
    return new Promise(

      (resolve, reject) => {
       
        const query = db.ref().child('categories').orderByChild('id').equalTo(id).once('value').then(
          (snapshotcategorie) => {
            
            snapshotcategorie.forEach(childsnapshotcategorie => {
              datacategorie1=childsnapshotcategorie.val();

            });
            
            resolve(datacategorie1);
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }
  getcategoriebyid(id){

    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/categories/' +id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }
   getAllprespectives(){
     const db = this.firebase.database;
 
     const query = db.ref().child('prespectives').get().then( (snapshot) => {
       var tablist:any = [];
         snapshot.forEach(childsnapshot => {
           tablist.push(childsnapshot.val());
           this.prespectives = tablist;
           this.emitPrestations();
         });
       } 
     );
 
   } 
 
   getprespectivesById(id?: string) {
   
     return new Promise(
       (resolve, reject) => {
         const db = this.firebase.database;
         const query = db.ref('/prespectives/' +id).once('value').then(
           (data: { val: () => any; }) => {
             resolve(data.val());
           }, (error: any) => {
             reject(error);
           }
         );
       }
     );
 
   }
 
   getdetailprespectivesById(id?: string) {
 
     return new Promise(
       (resolve, reject) => {
         const db = this.firebase.database;
         console.log('id ::: '+id);
           db.ref('/prespectives/'+id).once('value').then(
           (data: { val: () => any; }) => {
             resolve(data.val());
           }, (error: any) => {
             reject(error);
           }
         );
       }
     );
 
   }
 
   savePrespectives(newPrespective: Prespective) {
     const keyunique = 'cid-' + this.Randomkeys.createId();
     newPrespective.id = keyunique;
     const db = this.firebase.database;
     const query = db.ref('/prespectives/'+keyunique).set(newPrespective);
     this.emitPrestations();
   }
   
   async updatePrespectiveData(id,prespectiveData){
     const db = this.firebase.database;
     await  db.ref('/prespectives/'+id).update(prespectiveData);
   }
 
 
   removePrespectiveDatas(id) {
 
     if (confirm('Vous voulez vraiment supprimer les données de cet prestations?')) {
       const db = this.firebase.database;
       const query = db.ref('/prespectives/'+id).remove();
 
       this.emitPrestations();
     }
  
   }

 
 }