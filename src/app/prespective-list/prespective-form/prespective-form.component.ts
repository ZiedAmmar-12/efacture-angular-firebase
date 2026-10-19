import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Prespective } from 'src/app/models/Prespective.model';
import { PrespectivesService} from 'src/app/services/prespectives.service';
import { AuthService } from 'src/app/services/auth.service';
import { timeStamp } from 'console';



@Component({
  selector: 'app-prespective-form',
  templateUrl: './prespective-form.component.html',
  styleUrls: ['./prespective-form.component.css']
})
export class PrespectiveFormComponent {

  PrespectiveForm!: FormGroup;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  datecreation!:string;
  datemodification!:string;
  categoriedata: any;
  constructor(private formBuilder: FormBuilder,
            private prespectivesService: PrespectivesService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.prespectivesService.getAllcategorie().then(
      (data) => {
        this.categoriedata = data;
      }
    );
    this.initForm();
    
  }            
  
  initForm() {
    
    this.PrespectiveForm = this.formBuilder.group( {
      
      label:['',Validators.required],
      reference_Prestation: this.formBuilder.array([]),
      description: ['',Validators.required],
      quantite: ['',Validators.required],
      prix_unitaire_HT: ['',Validators.required],
      montant_HT: ['',Validators.required],
      optiontva: ['',Validators.required],

    });
      //category:['',Validators.required],
     
  }
  get label() {
    return this.PrespectiveForm.get('label');
  }
  get referencesforms() {
    return this.PrespectiveForm.get("reference_Prestation") as FormArray;
  }
  get description() {
    return this.PrespectiveForm.get('description');
  }
 /* get idcategorie() {
    return this.PrespectiveForm.get('idcategorie');
  }*/
  get quantite() {
    return this.PrespectiveForm.get('quantite');
  }
  get prix_unitaire_HT() {
    return this.PrespectiveForm.get('prix_unitaire_HT');
  }
  get montant_HT() {
    return this.PrespectiveForm.get('montant_HT');
  }
  get optiontva() {
    return this.PrespectiveForm.get('optiontva');
  }

  


  onSavePrespective() {
    
    const id ='';
    const label = this.PrespectiveForm.get('label')?.value;
    const reference_Prestation = this.PrespectiveForm.get('reference_Prestation')?.value; 
    const description = this.PrespectiveForm.get('description')?.value;
    const quantite = this.PrespectiveForm.get('quantite')?.value;
    const prix_unitaire_HT = this.PrespectiveForm.get('prix_unitaire_HT')?.value;
    const montant_HT = this.PrespectiveForm.get('montant_HT')?.value;
    const optiontva = this.PrespectiveForm.get('optiontva')?.value;
   // const category = this.PrespectiveForm.get('category')?.value;

  


  
      const uid_ = this.authService.getuid();
      console.log('ixi'+uid_);

      const datecreation = Date.now();
      console.log('ixi'+datecreation);

      const datemodification = Date.now();
      console.log('ixi'+datemodification);
   
      const newPrespective = new Prespective();

      newPrespective.id = id;
      newPrespective.label = label;
      newPrespective.reference_Prestation=reference_Prestation;
      newPrespective.description = description;
      newPrespective.quantite = quantite;
      newPrespective.prix_unitaire_HT = prix_unitaire_HT;
      newPrespective.montant_HT = montant_HT;
      newPrespective.optiontva = optiontva;
      //newPrespective.category = category;
 

  
    this.prespectivesService.savePrespectives(newPrespective);
    console.log(newPrespective)
    this.router.navigate(['/prespectives']);
  }
  onBack() {
    this.router.navigate(['/prespectives']);
  }
  
}





