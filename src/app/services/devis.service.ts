import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Devis } from '../models/Devis.model';
import { Subject } from 'rxjs';



import { getStorage, ref, getDownloadURL } from "firebase/storage";
@Injectable({
  providedIn: 'root'
})
export class DevisService {

  devis: Devis[] = [];
  devisobject: Devis = new Devis();
  devisSubject = new Subject<Devis[]>();
  datasociete: any;
  dataclient: any;
  dataclient1:any;
  keynumdevis: string= '';
  numdevisdata: any;
  nomsocietedata: any ;
  clientdata: any;
  prespectivedata:any;
  prespectives:any;
  prestationdata:any;
  prestations:any;
  clients: any;
  societes:any;
  devisSubscription: any;


  constructor(private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage, private storage: AngularFireStorage) { }

  emitDevis() {
    this.devisSubject.next(this.devis);
  }

  getnumerodevisbyid(idDevis:string){
    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/devis/'+idDevis).once('value').then(
          (snapshotdevis) => {
             var data = snapshotdevis.val();
             this.numdevisdata=data.numdevis;
            resolve(this.numdevisdata);
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );
  }

  getnumerodevis(idsociete: string){
    return new Promise(
                 (resolve, reject) => {
                   const db = this.firebase.database;
                   const query = db.ref().child('devis').orderByChild('idsociete').equalTo(idsociete).once('value').then(
                     (snapshotdevis) => {
                       var imonombre = snapshotdevis.numChildren()+1;
                     let numdevis:string ='';
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
                       numdevis = tabelement.toString();
                       numdevis = numdevis.replace(/,/g,"");
                       numdevis = 'DE-'+numdevis+'/'+year;
                       this.numdevisdata = numdevis;
                       
                     }else{
                      numdevis = imonombre.toString();
                      numdevis = 'DE-'+numdevis+'/'+year;
                       this.numdevisdata= numdevis;
                      
                     }
      
                       resolve(this.numdevisdata);
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


  getAlldevis(id){
    const db = this.firebase.database;
    var tablistdevis:any = [];

      const query2 = db.ref().child('devis').orderByChild('idsociete').equalTo(id)
    
                          .on( 'value', (snapshotdevis) => {
                            snapshotdevis.forEach(childsnapshotdevis => {
                              tablistdevis.push(childsnapshotdevis.val());
                              });
                              this.devis = tablistdevis;
                              this.emitDevis();
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
  getAllprespectives(){

    let dataprespective:any;
    const db = this.firebase.database;
    var tablistprespective:any = [];
    return new Promise(

      (resolve, reject) => {
       
        const query3 = db.ref().child('prespectives').once('value').then(

        (snapshotprespective) => {
            
          snapshotprespective.forEach(childsnapshotprespective => {
            tablistprespective.push(childsnapshotprespective.val());
            dataprespective=childsnapshotprespective.val();
            
          });

          this.prespectives = tablistprespective;
          
          
          resolve(this.prespectives);
        }, (error: any) => {
          reject(error);
        }
      );
    }
  );

                         
  }
  getAllprestations(){

    let dataprestation:any;
    const db = this.firebase.database;
    var tablistprestation:any = [];
    return new Promise(

      (resolve, reject) => {
       
        const query3 = db.ref().child('prestation').once('value').then(

        (snapshotprespective) => {
            
          snapshotprespective.forEach(childsnapshotprestation => {
            tablistprestation.push(childsnapshotprestation.val());
            dataprestation=childsnapshotprestation.val();
            
          });

          this.prestations = tablistprestation;
          
          
          resolve(this.prestations);
        }, (error: any) => {
          reject(error);
        }
      );
    }
  );

                         
  }

  getAllsociete(){

    let datasociete:any;
    const db = this.firebase.database;
    var tablistsociete:any = [];
    return new Promise(

      (resolve, reject) => {
       
        const query3 = db.ref().child('societes').once('value').then(

        (snapshotsociete) => {
            
          snapshotsociete.forEach(childsnapshotsociete => {
            tablistsociete.push(childsnapshotsociete.val());
            datasociete=childsnapshotsociete.val();
            
          });

          this.societes = tablistsociete;
          
          
          resolve(this.societes);
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

  getdevisById(id?: string) {
  
    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/devis/' +id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

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

  getdetaildevisById(id?: string) {

    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        console.log('id ::: '+id);
          db.ref('/devis/'+id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }
/*
  saveDevis(newDevis: Devis) {
    const keyunique = 'fid-' + this.Randomkeys.createId();
    newDevis.id = keyunique;
    const db = this.firebase.database;
    const query = db.ref('/devis/'+keyunique).set(newDevis);
    this.emitDevis();
  }
  */
  async updateDevisData(id,devisData){
    const db = this.firebase.database;
    await  db.ref('/devis/'+id).update(devisData);
  }

    saveDevis(newDevis: Devis): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        const keyunique = 'fid-' + this.Randomkeys.createId();
        newDevis.id = keyunique;
        const db = this.firebase.database;
        const query = db.ref('/devis/' + keyunique).set(newDevis)
          .then(() => {
            resolve(); // Résoudre la promesse lorsque la sauvegarde est réussie
          })
          .catch((error) => {
            reject(error); // Rejeter la promesse en cas d'erreur
          });
      });
    }


  removeDevis(id) {

    if (confirm('Vous voulez vraiment supprimer les données de cette devis?')) {
      const db = this.firebase.database;
      const query = db.ref('/devis/'+id).remove();

      this.emitDevis();
    }
 
  }
  
  getImageUrl(imagePath: string): Promise<string> {
    const storage = getStorage()
    const fileRef = ref(storage, imagePath);
    
    return getDownloadURL(fileRef);
  }

}