import { Component ,OnInit,Pipe} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Devis } from 'src/app/models/Devis.model';
import { Prestation, References } from 'src/app/models/Prestation.model';
import { AuthService } from 'src/app/services/auth.service';
import { DevisService } from 'src/app/services/devis.service';
import { PrestationService } from 'src/app/services/prestation.service';
@Component({
  selector: 'app-prestation-form',
  templateUrl: './prestation-form.component.html',
  styleUrls: ['./prestation-form.component.css']
})
export class PrestationFormComponent implements OnInit{
  
  prestation? :Prestation;
  devis : any;
  id: any;
  PrestationForm!: FormGroup;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  datecreation!:string;
  datemodification!:string;
  
  keynumDevis: string='';
  numdevisdata: any;
  societedata:any;
  nomsocietedata: any;
  clientdata: any;
  
  societesService: any;
  typedevfac: any;
  


  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private prestationService:PrestationService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    const idsociete = localStorage.getItem('idsocietestorage') || '' ;
    this.prestationService.getnomsociete(idsociete).then(
      (data) => {
        this.nomsocietedata= data;
        
      }
     );
    this.initForm();
  }            
  
  initForm() {

    

    const idsociete = localStorage.getItem('idsocietestorage') || '' ;
    
    this.PrestationForm= this.formBuilder.group( {
    
     
      label: ['', Validators.required],
      references: this.formBuilder.array([]),
      totalht: ['',Validators.required],
      optiontva: ['',Validators.required],
      tva: ['',Validators.required],
      timbrefiscal: ['',Validators.required],
      // type_dev_fac : ['',Validators.required],
      totalttc: ['',Validators.required],
      
    });
   
  }

  

  

  

  get label() {
    return this.PrestationForm.get('label');
  }

  get referencesforms() {
    return this.PrestationForm.get("references") as FormArray;
  }
  selecteoptiontva(){
    this.calculertotal();
  }

  addrefrenceFormGroup() {

    const newrefrencecontrol = this.formBuilder.group({
      refid:[1,Validators.required],
      description:['',Validators.required],
      quantite:[1,Validators.required],
      prix_unitaire_HT:['',Validators.required],
      montant_HT:['',Validators.required]
    });

    this.referencesforms.push(newrefrencecontrol);
    
    const refrencescalc = this.PrestationForm.get('references')?.value;
    for (let i = 0; i < refrencescalc.length; i++) {
      this.PrestationForm.get('references')?.get(`${i}`)?.get('refid')?.setValue(i+1);
    }

  }
 
  deletereferenceFormGroup(index: number) {
    this.referencesforms.removeAt(index);
    this.calculertotal();
  }

  onSavePrestation() {
    this.calculertotal();
    
   console.log('label',this.PrestationForm.get('label')?.value)
    const label = this.PrestationForm.get('label')?.value;

    const references = this.PrestationForm.get('references')?.value;    
    const totalht : number= Number (this.PrestationForm.get('totalht')?.value);
    const optiontva = this.PrestationForm.get('optiontva')?.value;
    const tva = this.PrestationForm.get('tva')?.value;
    const timbrefiscal : number= Number (this.PrestationForm.get('timbrefiscal')?.value);
    const totalttc : number= Number (this.PrestationForm.get('totalht')?.value);
   



      const uid_ = this.authService.getuid();
      

      const datecreation = Date.now();
     

      const datemodification = Date.now();
      
      const newPrestation = new Prestation();

      newPrestation.label = label;
      newPrestation.references = references;
      newPrestation.totalht = totalht;
      newPrestation.optiontva = optiontva;
      newPrestation.tva = tva;
      newPrestation.timbrefiscal = timbrefiscal;
      newPrestation.totalttc = totalttc;
      newPrestation.uid = uid_;
      newPrestation.datecreation = datecreation;
      newPrestation.datemodification = datemodification;


    

    this.prestationService.savePrestation(newPrestation);
    console.log(newPrestation);
    this.router.navigate(['/prespectives']);
  }

  calculertotal(){

    let totalHTcalc = 0;

    const refrencescalc = this.PrestationForm.get('references')?.value;
    console.log('ref',refrencescalc)
    for (let i = 0; i < refrencescalc.length; i++) {
      const quantite = refrencescalc[i].quantite;
      const prix_unitaire_HT = refrencescalc[i].prix_unitaire_HT;
      const montantHTcalc = Number(quantite * prix_unitaire_HT);
      this.PrestationForm.get('references')?.get(`${i}`)?.get('montant_HT')?.setValue(montantHTcalc);
      totalHTcalc = totalHTcalc + montantHTcalc; 
   }

    const optiontva : number= Number (this.PrestationForm.get('optiontva')?.value);
    const TVAcalc = Number (totalHTcalc * optiontva / 100);
    const totalTTCcalc=totalHTcalc + TVAcalc;
    
    
    this.PrestationForm.controls['totalht'].setValue(totalHTcalc);
    this.PrestationForm.controls['tva'].setValue(TVAcalc);
    if(this.typedevfac=='TND'){
      this.PrestationForm.controls['timbrefiscal'].setValue(0.600);
    }else{
      this.PrestationForm.controls['timbrefiscal'].setValue(0);
    }
    this.PrestationForm.controls['totalttc'].setValue(totalTTCcalc);
  }

  

  selecteddeviseoption(){
    const type_dev_fac = this.PrestationForm.get('type_dev_fac')?.value;
    this.typedevfac = type_dev_fac;
    this.PrestationForm.patchValue({timbrefiscal:'0.600'});
    this.calculertotal();
  }
  
  onBack() {
    this.router.navigate(['/prespectives']);
  }
  
}
