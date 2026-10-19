import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Facture } from '../models/Facture.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FacturesService {

  factures: Facture[] = [];
  factureobject: Facture = new Facture();
  facturesSubject = new Subject<Facture[]>();
  datasociete: any;
  dataclient: any;
  dataclient1:any;
  keynumfacture: string= '';
  numfacturedata: any;
  nomsocietedata: any ;
  clientdata: any;
  clients: any;


  constructor(private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage) { }

  emitFactures() {
    this.facturesSubject.next(this.factures);
  }

  getnumerofacturebyid(idfacture:string){
    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/factures/'+idfacture).once('value').then(
          (snapshotfacture) => {
             var data = snapshotfacture.val();
             this.numfacturedata=data.numfacture;
            resolve(this.numfacturedata);
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );
  }

  getnumerofacture(idsociete: string){
    return new Promise(
                 (resolve, reject) => {
                   const db = this.firebase.database;
                   const query = db.ref().child('factures').orderByChild('idsociete').equalTo(idsociete).once('value').then(
                     (snapshotfacture) => {
                       var imonombre = snapshotfacture.numChildren()+1;
                     let numfacture:string ='';
                     const monnombre: string = imonombre.toString();
                     monnombre.split('');
                     const nbr = 3 - monnombre.length;
                     const tabelement: any = [];
                     const year = new Date().getFullYear();
                     if(nbr > 0){
                       for (let i = 0; i < nbr; i++) {
                         tabelement.push('0'); 
                       }
                       tabelement.push(imonombre);
                       numfacture = tabelement.toString();
                       numfacture = numfacture.replace(/,/g,"");
                       numfacture = 'FA-'+numfacture+'/'+year;
                       this.numfacturedata = numfacture;
                       
                     }else{
                       numfacture = imonombre.toString();
                       numfacture = 'FA-'+numfacture+'/'+year;
                       this.numfacturedata= numfacture;
                      
                     }
      
                       resolve(this.numfacturedata);
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

  getnomclient(id: string) {
    
    let dataclient1:any;
    const db = this.firebase.database;
    return new Promise(

      (resolve, reject) => {
       
        const query = db.ref().child('clients').orderByChild('id').equalTo(id).once('value').then(
          (snapshotclient) => {
            
            snapshotclient.forEach(childsnapshotclient => {
              dataclient1=childsnapshotclient.val();

            });
            
            resolve(dataclient1);
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }


  getAllfacture(id){
    const db = this.firebase.database;
    var tablistfacture:any = [];

      const query2 = db.ref().child('factures').orderByChild('idsociete').equalTo(id)
                          .on( 'value', (snapshotfacture) => {
                              snapshotfacture.forEach(childsnapshotfacture => {
                                tablistfacture.push(childsnapshotfacture.val());
                              });
                              this.factures = tablistfacture;
                              this.emitFactures();
                            } );
  }

  getAllclient(){

    let dataclient:any;
    const db = this.firebase.database;
    var tablistclient:any = [];
    return new Promise(

      (resolve, reject) => {
       
        const query3 = db.ref().child('clients').once('value').then(

        (snapshotclient) => {
            
          snapshotclient.forEach(childsnapshotclient => {
            tablistclient.push(childsnapshotclient.val());
            dataclient=childsnapshotclient.val();
            
          });

          this.clients = tablistclient;
          
          
          resolve(this.clients);
        }, (error: any) => {
          reject(error);
        }
      );
    }
  );

                         
  }

  

  getsocietebyid(id){

    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/societes/' +id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }

  getfactureById(id?: string) {
  
    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/factures/' +id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }

  getdetailfactureById(id?: string) {

    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        console.log('id ::: '+id);
          db.ref('/factures/'+id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }

  saveFactures(newFacture: Facture) {
    const keyunique = 'fid-' + this.Randomkeys.createId();
    newFacture.id = keyunique;
    const db = this.firebase.database;
    const query = db.ref('/factures/'+keyunique).set(newFacture);
    this.emitFactures();
  }
  
  async updateFactureData(id,factureData){
    const db = this.firebase.database;
    await  db.ref('/factures/'+id).update(factureData);
  }


  removeFacture(id) {

    if (confirm('Vous voulez vraiment supprimer les données de cette facture?')) {
      const db = this.firebase.database;
      const query = db.ref('/factures/'+id).remove();

      this.emitFactures();
    }
 
  }

}