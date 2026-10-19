import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Subject } from 'rxjs';

import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Prestationdevis } from '../models/Prestationdevis.model';

@Injectable({
    providedIn: 'root'
})

export class PrestationdevisService {
    getAllsociete() {
      throw new Error('Method not implemented.');
    }
    prestationdevis:Prestationdevis[]=[];
   
    prestationdevisobject: Prestationdevis = new Prestationdevis();
    prestationdevisSubject = new Subject<Prestationdevis[]>();
    
    keynumdevis: string= '';
    numprestationdevisdata: any;
    prestationdevisSubscription: any;
  
  
    constructor(private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage, private storage: AngularFireStorage) { }
  
    emitPrestationdevis() {
      this.prestationdevisSubject.next(this.prestationdevis);
    }
  
    getnumeroprestationdevisbyid(idPrestation:string){
      return new Promise(
        (resolve, reject) => {
          const db = this.firebase.database;
          const query = db.ref('/prestation/'+idPrestation).once('value').then(
            (snapshotprestation) => {
               var data = snapshotprestation.val();
               this.numprestationdevisdata=data.numprestation;
              resolve(this.numprestationdevisdata);
            }, (error: any) => {
              reject(error);
            }
          );
        }
      );
    }
  
    getnomsociete(id: string) {
      
      let datasociete:any;
      const db = this.firebase.database;
      return new Promise(
  
        (resolve, reject) => {
         
          const query = db.ref().child('societes').orderByChild('id').equalTo(id).once('value').then(
            (snapshotsociete) => {
              
              snapshotsociete.forEach(childsnapshotsociete => {
                datasociete=childsnapshotsociete.val();
  
              });
              
              resolve(datasociete);
            }, (error: any) => {
              reject(error);
            }
          );
        }
      );
  
    }
  
  
    getAllprestationdevis(){
      const db = this.firebase.database;
      var tablistprestationdevis:any = [];
  
        const query2 = db.ref().child('prestation').once('value').then(
           (snapshotprestation) => {
                              snapshotprestation.forEach(childsnapshotprestation => {
                                tablistprestationdevis.push(childsnapshotprestation.val());
                                });
                                this.prestationdevis = tablistprestationdevis;
                                console.log('all data',this.prestationdevis)
  
                                this.emitPrestationdevis();
                              } );
    }
  
    getprestationdevisById(id?: string) {
    
      return new Promise(
        (resolve, reject) => {
          const db = this.firebase.database;
          const query = db.ref('/prestation/' +id).once('value').then(
            (data: { val: () => any; }) => {
              resolve(data.val());
            }, (error: any) => {
              reject(error);
            }
          );
        }
      );
  
    }
    
    getdetailprestationdevisById(id?: string) {
  
      return new Promise(
        (resolve, reject) => {
          const db = this.firebase.database;
          console.log('id ::: '+id);
            db.ref('/prestation/'+id).once('value').then(
            (data: { val: () => any; }) => {
              resolve(data.val());
            }, (error: any) => {
              reject(error);
            }
          );
        }
      );
  
    }
  
    savePrestationdevis(newPrestationdevis: Prestationdevis) {
      const keyunique = 'fid-' + this.Randomkeys.createId();
      newPrestationdevis.id = keyunique;
      const db = this.firebase.database;
      const query = db.ref('/prestation/'+keyunique).set(newPrestationdevis);
      this.emitPrestationdevis();
    }
   
  
    async updatePrestationdevisData(id,prestationdevisData){
      const db = this.firebase.database;
      await  db.ref('/prestation/'+id).update(prestationdevisData);
    }
  
  
    removePrestationdevis(id) {
  
      if (confirm('Vous voulez vraiment supprimer les données de cette prestation?')) {
        const db = this.firebase.database;
        const query = db.ref('/prestation/'+id).remove();
  
        this.emitPrestationdevis();
      }
   
    }
    
  
  
  }