import { Injectable } from '@angular/core';

import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';

import { Subject } from 'rxjs';
import { Categorie } from '../models/Categorie.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  categories: Categorie[] = [];
 categorieobject: Categorie = new Categorie();
  categoriesSubject = new Subject<Categorie[]>();

  constructor(private firebase: AngularFireDatabase, private Randomkeys : AngularFirestore, private fireStorage : AngularFireStorage) { }

  emitCategories() {
    this.categoriesSubject.next(this.categories);
  }

  getAllcategorie(){
    const db = this.firebase.database;

    const query = db.ref().child('categories').get().then( (snapshot) => {
      var tablist:any = [];
        snapshot.forEach(childsnapshot => {
          tablist.push(childsnapshot.val());
          this.categories = tablist;
          this.emitCategories();
        });
      } 
    );

  } 

  getcategorieById(id?: string) {
  
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

  getdetailcategorieById(id?: string) {

    return new Promise(
      (resolve, reject) => {
        const db = this.firebase.database;
        console.log('id ::: '+id);
          db.ref('/categories/'+id).once('value').then(
          (data: { val: () => any; }) => {
            resolve(data.val());
          }, (error: any) => {
            reject(error);
          }
        );
      }
    );

  }

  saveCategories(newCategorie: Categorie) {
    const keyunique = 'cid-' + this.Randomkeys.createId();
    newCategorie.id = keyunique;
    const db = this.firebase.database;
    const query = db.ref('/categories/'+keyunique).set(newCategorie);
    this.emitCategories();
  }
  
  async updateCategorieData(id,categorieData){
    const db = this.firebase.database;
    await  db.ref('/categories/'+id).update(categorieData);
  }


  removeCategorie(id) {

    if (confirm('Vous voulez vraiment supprimer les données de cet categories?')) {
      const db = this.firebase.database;
      const query = db.ref('/categories/'+id).remove();

      this.emitCategories();
    }
 
  }


}
