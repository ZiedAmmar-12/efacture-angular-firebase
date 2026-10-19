import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-categorie-edit',
  templateUrl: './categorie-edit.component.html',
  styleUrls: ['./categorie-edit.component.css']
})
export class CategorieEditComponent implements OnInit {


  categorie : any;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  id: any;
  CategorieFormedit= new FormGroup({

        nomcategorie: new FormControl('',[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
       
  });

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private authService: AuthService,
              private router: Router,
              ) { }

  
  ngOnInit(): void {
    
      this.initForm();
        
  }

  initForm() {
    this.categoriesService.getcategorieById(this.route.snapshot.params["id"]).then(
      (result:any) =>{
        console.log('test');
        console.log(result.etat);
        console.log('test');
        this.CategorieFormedit= new FormGroup({
          nomcategorie: new FormControl(result.nomcategorie,[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
         

        });
      }
    );
    

  }



  onUpdateCategorieedit(CategorieFormedit) {

      let categorieData:any = {};

      categorieData.nomcategorie = CategorieFormedit.value.nomcategorie;

        

      categorieData.datecreation = Date.now();
      categorieData.datemodification = Date.now();

        let id = this.route.snapshot.params["id"];
      
      this.categoriesService.updateCategorieData(id,categorieData);
      this.router.navigate(['/categories']);
  }


  

  onBack() {
    this.router.navigate(['/categories']);
  }

}