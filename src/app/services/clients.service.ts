import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Client } from '../models/Client.model';
import { Subject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  clients: Client[] = [];
  clientobject: Client = new Client();
  clientsSubject = new Subject<Client[]>();

  constructor(private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage) { }

  emitClients() {
    this.clientsSubject.next(this.clients);
  }

  getAllclient(){
    const db = this.firebase.database;

    const query = db.ref().child('clients').get().then( (snapshot) => {
      var tablist:any = [];
        snapshot.forEach(childsnapshot => {
          tablist.push(childsnapshot.val());
          this.clients = tablist;
          this.emitClients();
        });
      } 
    );

  } 

  getclientById(id?: string) {
  
    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        const query = db.ref('/clients/' +id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }

  getdetailclientById(id?: string) {

    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        console.log('id ::: '+id);
          db.ref('/clients/'+id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }

  saveClients(newClient: Client) {
    const keyunique = 'cid-' + this.Randomkeys.createId();
    newClient.id = keyunique;
    const db = this.firebase.database;
    const query = db.ref('/clients/'+keyunique).set(newClient);
    this.emitClients();
  }
  
  async updateClientData(id,clientData){
    const db = this.firebase.database;
    await  db.ref('/clients/'+id).update(clientData);
  }


  removeClient(id) {

    if (confirm('Vous voulez vraiment supprimer les données de cet client?')) {
      const db = this.firebase.database;
      const query = db.ref('/clients/'+id).remove();

      this.emitClients();
    }
 
  }


}





