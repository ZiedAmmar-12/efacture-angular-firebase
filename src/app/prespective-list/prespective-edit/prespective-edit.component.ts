import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
import { AuthService } from 'src/app/services/auth.service';
import { PrespectivesService } from 'src/app/services/prespectives.service';

@Component({
  selector: 'app-prespective-edit',
  templateUrl: './prespective-edit.component.html',
  styleUrls: ['./prespective-edit.component.css']
})
export class PrespectiveEditComponent implements OnInit {


  prespective : any;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  id: any;
  PrespectiveFormedit= new FormGroup({

        
        description: new FormControl('',[Validators.required]),
        quantite: new FormControl('',[Validators.required]),
        prix_unitaire_HT: new FormControl('',[Validators.required]),
        montant_HT: new FormControl('',[Validators.required]),
        optiontva: new FormControl('',[Validators.required]),
        category: new FormControl('',[Validators.required]),
  })

  constructor(private route: ActivatedRoute,
              private prespectivesService: PrespectivesService,
              private authService: AuthService,
              private router: Router,
              ) { }

  
  ngOnInit(): void {
    
      this.initForm();
        
  }

  initForm() {
    this.prespectivesService.getprespectivesById(this.route.snapshot.params["id"]).then(
      (result:any) =>{
       
        this.PrespectiveFormedit= new FormGroup({
        //  nomcategorie: new FormControl(result.nomcategorie,[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
         
        description: new FormControl(result.description,[Validators.required]),
        quantite: new FormControl(result.quantite,[Validators.required]),
        prix_unitaire_HT: new FormControl(result.prix_unitaire_HT,[Validators.required]),
        montant_HT: new FormControl(result.montant_HT,[Validators.required]),
        optiontva: new FormControl(result.optiontva,[Validators.required]),
        category: new FormControl(result.category,[Validators.required]),
        });
      }
    );
    

  }



  onUpdatePrespectiveedit(PrespectiveFormedit) {

      let prespectiveData:any = {};

      prespectiveData.description = PrespectiveFormedit.value.description;
      prespectiveData.quantite = PrespectiveFormedit.value.quantite;
      prespectiveData.prix_unitaire_HT = PrespectiveFormedit.value.prix_unitaire_HT;
      prespectiveData.montant_HT = PrespectiveFormedit.value.montant_HT;
      prespectiveData.optiontva = PrespectiveFormedit.value.optiontva;
      prespectiveData.category = PrespectiveFormedit.value.category;
      

        

      prespectiveData.datecreation = Date.now();
      prespectiveData.datemodification = Date.now();

        let id = this.route.snapshot.params["id"];
      
      this.prespectivesService.updatePrespectiveData(id,prespectiveData);
      this.router.navigate(['/prespectives']);
  }
  


  

  onBack() {
    this.router.navigate(['/prespectives']);
  }

}