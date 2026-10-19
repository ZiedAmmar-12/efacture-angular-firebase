import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Devis } from '../models/Devis.model';
import { Subject } from 'rxjs';



import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { Prestation } from '../models/Prestation.model';
@Injectable({
  providedIn: 'root'
})
export class PrestationService {
  getAllsociete() {
    throw new Error('Method not implemented.');
  }
  prestation:Prestation[]=[];
 
  prestationobject: Prestation = new Prestation();
  prestationSubject = new Subject<Prestation[]>();
  
  keynumdevis: string= '';
  numprestationdata: any;
  prestationSubscription: any;


  constructor(private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage, private storage: AngularFireStorage) { }

  emitPrestation() {
    this.prestationSubject.next(this.prestation);
  }

  getnumeroprestationbyid(idPrestation:string){
    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/prestation/'+idPrestation).once('value').then(
          (snapshotprestation) => {
             var data = snapshotprestation.val();
             this.numprestationdata=data.numprestation;
            resolve(this.numprestationdata);
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


  getAllprestation(){
    const db = this.firebase.database;
    var tablistprestation:any = [];

      const query2 = db.ref().child('prestation').once('value').then(
         (snapshotprestation) => {
                            snapshotprestation.forEach(childsnapshotprestation => {
                              tablistprestation.push(childsnapshotprestation.val());
                              });
                              this.prestation = tablistprestation;
                              console.log('all data',this.prestation)

                              this.emitPrestation();
                            } );
  }

  getprestationById(id?: string) {
  
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
  
  getdetailprestationById(id?: string) {

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

  savePrestation(newPrestation: Prestation) {
    const keyunique = 'fid-' + this.Randomkeys.createId();
    newPrestation.id = keyunique;
    const db = this.firebase.database;
    const query = db.ref('/prestation/'+keyunique).set(newPrestation);
    this.emitPrestation();
  }
 

  async updatePrestationData(id,prestationData){
    const db = this.firebase.database;
    await  db.ref('/prestation/'+id).update(prestationData);
  }


  removePrestation(id) {

    if (confirm('Vous voulez vraiment supprimer les données de cette prestation?')) {
      const db = this.firebase.database;
      const query = db.ref('/prestation/'+id).remove();

      this.emitPrestation();
    }
 
  }
  


}