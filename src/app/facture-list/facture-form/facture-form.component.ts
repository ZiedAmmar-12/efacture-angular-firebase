import { Component, OnInit,Pipe } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Facture } from 'src/app/models/Facture.model';
import { Societe } from 'src/app/models/Societe.model'; 
import { FacturesService } from 'src/app/services/factures.service';
import { AuthService } from 'src/app/services/auth.service';
import { timeStamp } from 'console';


@Component({
  selector: 'app-facture-form',
  templateUrl: './facture-form.component.html',
  styleUrls: ['./facture-form.component.css']
})

export class FactureFormComponent {
  facture : any;
  id: any;
  FactureForm!: FormGroup;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  datecreation!:string;
  datemodification!:string;
  
  keynumfacture: string='';
  numfacturedata: any;
  nomsocietedata: any;
  clientdata: any;
  societesService: any;
  typedevfac: any;
  


  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private facturesService: FacturesService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    
    const idsociete = localStorage.getItem('idsocietestorage') || '' ;
    
    this.facturesService.getnumerofacture(idsociete).then(
      (data) => {
        this.numfacturedata= data;
       
      }
     );

    
    this.facturesService.getnomsociete(idsociete).then(
      (data) => {
        this.nomsocietedata= data;
        
      }
     );

    this.facturesService.getAllclient().then(
      (data) => {
        this.clientdata= data; 
      }
    );

    this.initForm();
  }            
  
  initForm() {

    

    const idsociete = localStorage.getItem('idsocietestorage') || '' ;
    
    this.FactureForm = this.formBuilder.group( {
      idsociete: [''], 
      idclient: ['', Validators.required],
      type_dev_fac: ['', Validators.required],
      numfacture: [''],
      references: this.formBuilder.array([]),
      totalht: ['',Validators.required],
      optiontva: ['',Validators.required],
      tva: ['',Validators.required],
      timbrefiscal: ['',Validators.required],
      totalttc: ['',Validators.required],
      date_valid_fact: ['', Validators.required],
    });
   
  }

  get idsociete() {
    return this.FactureForm.get('idsociete');
  }

  get idclient() {
    return this.FactureForm.get('idclient');
  }

  get numfacture() {
    console.log('numfacture'); 
    console.log(this.FactureForm.get('numfacture'));
    return this.FactureForm.get('numfacture');
  }

  get date_valid_fact() {
    return this.FactureForm.get('date_valid_fact');
  }

  get type_dev_fac() {
    return this.FactureForm.get('type_dev_fac');
  }

  get referencesforms() {
    return this.FactureForm.get("references") as FormArray;
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
    
    const refrencescalc = this.FactureForm.get('references')?.value;
    for (let i = 0; i < refrencescalc.length; i++) {
      this.FactureForm.get('references')?.get(`${i}`)?.get('refid')?.setValue(i+1);
    }

  }
 
  deletereferenceFormGroup(index: number) {
    this.referencesforms.removeAt(index);
    this.calculertotal();
  }

  onSaveFacture() {
    this.calculertotal();
    const id = '';
    const idsociete =this.nomsocietedata.id;
    
    const idclient = this.FactureForm.get('idclient')?.value;
    const type_dev_fac = this.FactureForm.get('type_dev_fac')?.value;
    const numfacture = this.numfacturedata;
    
    const references = this.FactureForm.get('references')?.value;    
    const totalht : number= Number (this.FactureForm.get('totalht')?.value);
    const optiontva = this.FactureForm.get('optiontva')?.value;
    const tva = this.FactureForm.get('tva')?.value;
    const timbrefiscal : number= Number (this.FactureForm.get('timbrefiscal')?.value);
    const totalttc : number= Number (this.FactureForm.get('totalht')?.value);
    const date_valid_fact = this.FactureForm.get('date_valid_fact')?.value;



      const uid_ = this.authService.getuid();
      

      const datecreation = Date.now();
     

      const datemodification = Date.now();
      
      const newFacture = new Facture();

      newFacture.id = id;      
      newFacture.idsociete = idsociete; 
      newFacture.idclient = idclient;
      newFacture.type_dev_fac = type_dev_fac;  
      newFacture.numfacture = numfacture;
      newFacture.references = references;
      newFacture.totalht = totalht;
      newFacture.optiontva = optiontva;
      newFacture.tva = tva;
      newFacture.timbrefiscal = timbrefiscal;
      newFacture.totalttc = totalttc;
      newFacture.date_valid_fact = date_valid_fact;
      newFacture.uid = uid_;
      newFacture.datecreation = datecreation;
      newFacture.datemodification = datemodification;


    

    this.facturesService.saveFactures(newFacture);
    console.log(newFacture);
    this.router.navigate(['/factures']);
  }

  calculertotal(){

    let totalHTcalc = 0;

    const refrencescalc = this.FactureForm.get('references')?.value;
    for (let i = 0; i < refrencescalc.length; i++) {
      const quantite = refrencescalc[i].quantite;
      const prix_unitaire_HT = refrencescalc[i].prix_unitaire_HT;
      const montantHTcalc = Number(quantite * prix_unitaire_HT);
      this.FactureForm.get('references')?.get(`${i}`)?.get('montant_HT')?.setValue(montantHTcalc);
      totalHTcalc = totalHTcalc + montantHTcalc; 
   }

    const optiontva : number= Number (this.FactureForm.get('optiontva')?.value);
    const TVAcalc = Number (totalHTcalc * optiontva / 100);
    const totalTTCcalc=totalHTcalc + TVAcalc;
    
    
    this.FactureForm.controls['totalht'].setValue(totalHTcalc);
    this.FactureForm.controls['tva'].setValue(TVAcalc);
    if(this.typedevfac=='TND'){
      this.FactureForm.controls['timbrefiscal'].setValue(0.600);
    }else{
      this.FactureForm.controls['timbrefiscal'].setValue(0);
    }
    this.FactureForm.controls['totalttc'].setValue(totalTTCcalc);
  }

  selecteoptiontva(){
    this.calculertotal();
  }

  selecteddeviseoption(){
    const type_dev_fac = this.FactureForm.get('type_dev_fac')?.value;
    this.typedevfac = type_dev_fac;
    this.FactureForm.patchValue({timbrefiscal:'0.600'});
    this.calculertotal();
  }
  
  onBack() {
    this.router.navigate(['/factures']);
  }
  
}