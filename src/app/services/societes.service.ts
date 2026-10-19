import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage,  } from '@angular/fire/compat/storage';

import { Societe } from '../models/Societe.model';
import { Subject } from 'rxjs';
import { getStorage, ref, getDownloadURL } from "firebase/storage";
@Injectable({
  providedIn: 'root'
})
export class SocietesService {

  societes: Societe[] = [];
  societeobject: Societe = new Societe();
  societesSubject = new Subject<Societe[]>();
  datacategorie: any;
  categories:any;

 
  

  constructor(private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage,private storage: AngularFireStorage) { }

  emitSocietes() {
    this.societesSubject.next(this.societes);
  }

  getAllsociete(){
    const db = this.firebase.database;

    const query = db.ref().child('societes').get().then( (snapshot) => {
      var tablist:any = [];
        snapshot.forEach(childsnapshot => {
          tablist.push(childsnapshot.val());
          this.societes = tablist;
          this.emitSocietes();
        });
      } 
    );

  } 

  getsocieteById(id?: string) {
  
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

  getdetailsocieteById(id?: string) {

    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        console.log('id ::: '+id);
          db.ref('/societes/'+id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }

  saveSocietes(newSociete: Societe) {
    const keyunique = 'sid-' + this.Randomkeys.createId();
    newSociete.id = keyunique;
    const db = this.firebase.database;
    const query = db.ref('/societes/'+keyunique).set(newSociete);
    this.emitSocietes();
  }
  
  async updateSocieteData(id,societeData){
    const db = this.firebase.database;
    await  db.ref('/societes/'+id).update(societeData);
  }


  removeSociete(id) {

    if (confirm('Vous voulez vraiment supprimer les données de cette société?')) {
      const db = this.firebase.database;
      const query = db.ref('/societes/'+id).remove();

      this.emitSocietes();
    }
 
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
  uploadImagetoStorage(file: File): Promise<string> {
    console.log('upload img to server',file.name)
    const filePath = `images/${Date.now()}_${file.name}`;
    const fileRef = this.storage.ref(filePath).child(file.name);
    return fileRef.put(file).then((result)=> result.ref.fullPath )
  
   
  }
  getImageUrl(imagePath: string): Promise<string> {
    const storage = getStorage()
    const fileRef = ref(storage, imagePath);
    
    return getDownloadURL(fileRef);
  }
 
}
