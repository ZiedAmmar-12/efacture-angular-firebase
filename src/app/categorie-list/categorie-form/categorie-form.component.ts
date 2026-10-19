import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Categorie } from 'src/app/models/Categorie.model';
import { CategoriesService } from 'src/app/services/categories.service';
import { AuthService } from 'src/app/services/auth.service';
import { timeStamp } from 'console';
@Component({
  selector: 'app-categorie-form',
  templateUrl: './categorie-form.component.html',
  styleUrls: ['./categorie-form.component.css']
})
export class CategorieFormComponent {

  CategorieForm!: FormGroup;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  datecreation!:string;
  datemodification!:string;
 
  constructor(private formBuilder: FormBuilder,
              private categoriesService: CategoriesService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }            
  
  initForm() {
    this.CategorieForm = this.formBuilder.group( {
      nomcategorie: ['',[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]],
     


    });
  }

  get nomcategorie() {
    return this.CategorieForm.get('nomcategorie');
  }

  onSaveCategorie() {
    
    const id ='';
    const nomcategorie = this.CategorieForm.get('nomcategorie')?.value;
  


  
      const uid_ = this.authService.getuid();
      console.log('ixi'+uid_);

      const datecreation = Date.now();
      console.log('ixi'+datecreation);

      const datemodification = Date.now();
      console.log('ixi'+datemodification);
   
      const newCategorie = new Categorie();

      newCategorie.id = id;
      newCategorie.nomcategorie = nomcategorie;
 

  
    this.categoriesService.saveCategories(newCategorie);
    this.router.navigate(['/categories']);
  }
  onBack() {
    this.router.navigate(['/categories']);
  }
  
}



