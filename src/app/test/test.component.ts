
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Devis, DevisItems, DevisModel } from 'src/app/models/Devis.model';
import { Prespective } from 'src/app/models/Prespective.model';
import { AuthService } from 'src/app/services/auth.service';
import { DevisService } from 'src/app/services/devis.service';
import { PrespectivesService } from 'src/app/services/prespectives.service';
import { PrestationService } from 'src/app/services/prestation.service';
import { Prestation } from '../models/Prestation.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css'],
})
export class TestComponent implements OnInit {
  DevisForm!: FormGroup;
  devisFormArray!: FormArray;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!: string;
  datecreation!: string;
  datemodification!: string;
  keynumDevis: string = '';
  numdevisdata: any;
  nomsocietedata: any;
  clientdata: any;
  prespectivedata: any;
  prestationdata: any;
  societesService: any;
  typedevfac: any;
  selectedPerspective: Prestation | undefined;
  categoriedata: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private devisService: DevisService,
    private authService: AuthService,
    private prespectivesService: PrespectivesService,
    private prestationService: PrestationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.prespectivesService.getAllcategorie().then((data) => {
      this.categoriedata = data;
    });

    const idsociete = localStorage.getItem('idsocietestorage') || '';

    this.devisService.getnumerodevis(idsociete).then((data) => {
      this.numdevisdata = data;
    });

    this.devisService.getnomsociete(idsociete).then((data) => {
      this.nomsocietedata = data;
    });

    this.devisService.getAllclient().then((data) => {
      this.clientdata = data;
    });

    this.devisService.getAllprespectives().then((data) => {
      this.prespectivedata = data;
    });

    this.devisService.getAllprestations().then((data) => {
      this.prestationdata = data;
    });

    this.initForm();
  }

  initForm() {
    this.DevisForm = this.formBuilder.group({
      devisForms: this.formBuilder.array([]),
      idclient: ['', Validators.required], // Ajout du champ idclient
      type_dev_fac: ['', Validators.required],
    });

    this.addDevisFormGroup();
  }

  get devisForms(): FormArray {
    return this.DevisForm.get('devisForms') as FormArray;
  }
  addDevisFormGroup() {
    const devisFormGroup = this.formBuilder.group({
      label: ['', Validators.required],
      references: this.formBuilder.array([]),
      totalht: ['', Validators.required],
      optiontva: ['', Validators.required],
      tva: ['', Validators.required],
      timbrefiscal: ['', Validators.required],
      totalttc: ['', Validators.required],
      date_valid_fact: ['', Validators.required],
    });

    this.devisForms.push(devisFormGroup);

  }

  addReferenceFormGroup(devisIndex: number) {
    const referenceFormGroup = this.formBuilder.group({
      refid: [1, Validators.required],
      description: ['', Validators.required],
      quantite: [1, Validators.required],
      prix_unitaire_HT: ['', Validators.required],
      montant_HT: ['', Validators.required],
    });

    const referencesArray = this.devisForms
      .at(devisIndex)
      .get('references') as FormArray;
    referencesArray.push(referenceFormGroup);

    referencesArray.controls.forEach((control, index) => {
      control.get('refid')?.setValue(index + 1);
    });

    this.calculertotal(devisIndex);
  }

  deleteReferenceFormGroup(devisIndex: number, referenceIndex: number) {
    const referencesArray = this.devisForms
      .at(devisIndex)
      .get('references') as FormArray;
    referencesArray.removeAt(referenceIndex);
    this.calculertotal(devisIndex);
  }

  
  deleteDevisFormGroup(devisIndex: number) {
    this.devisForms.removeAt(devisIndex);
  }
 /* onSaveDevis() {

    const newDevis =new DevisModel();
    newDevis.id = '';
    newDevis.idsociete = this.nomsocietedata.id;
    const idclient = this.DevisForm.get('idclient')?.value;
    const type_dev_fac = this.DevisForm.get('type_dev_fac')?.value;
   // const items = new devisItems();





   const id = '';
   const idsociete =this.nomsocietedata.id;
   
   
   const numDevis = this.numdevisdata;
   
   const date_valid_fact = this.DevisForm.get('date_valid_fact')?.value;



     const uid_ = this.authService.getuid();
     

     const datecreation = Date.now();
    

     const datemodification = Date.now();
     
    

     newDevis.id = id;      
     newDevis.idsociete = idsociete; 
     newDevis.idclient = idclient;
     newDevis.type_dev_fac = type_dev_fac;  
     newDevis.numDevis = numDevis;
     newDevis.date_valid_fact = date_valid_fact;
     newDevis.uid = uid_;
     newDevis.datecreation = datecreation;
     newDevis.datemodification = datemodification;
     newDevis.devisItems=[]

     this.devisForms.controls.forEach((devisFormGroup, index) => {
      const devisItems= new DevisItems()

      this.calculertotal(index);
    
      devisItems.label = devisFormGroup.get('label')?.value;
      devisItems.references = devisFormGroup.get('references')?.value;
      devisItems.totalht = Number(devisFormGroup.get('totalht')?.value);
      devisItems.optiontva = devisFormGroup.get('optiontva')?.value;
      devisItems.tva = devisFormGroup.get('tva')?.value;
      devisItems.timbrefiscal = Number(devisFormGroup.get('timbrefiscal')?.value);
      devisItems.totalttc = Number(devisFormGroup.get('totalttc')?.value);
      newDevis.totalAmount += devisItems.totalttc
      console.log("totalAmount ", newDevis.totalAmount);

      console.log("devisForms ",devisItems);

      newDevis.devisItems!.push(devisItems) 
     console.log("newDevis ",newDevis);

  })
  
      newDevis.uid = this.authService.getuid();
      newDevis.datecreation = Date.now();
      newDevis.datemodification = Date.now();
      
  this.devisService.saveDevis(newDevis);
   console.log("devis toSaved ",newDevis);
   this.router.navigate(['/devis']);



   
    //this.devisService.saveDevis(newDevis);
    //this.router.navigate(['/devish']);
  }
*/
onSaveDevis() {
  const newDevis = new DevisModel();
  newDevis.idsociete = this.nomsocietedata.id;
  newDevis.idclient = this.DevisForm.get('idclient')?.value;
  newDevis.type_dev_fac = this.DevisForm.get('type_dev_fac')?.value;
  newDevis.numDevis = this.numdevisdata;
  newDevis.date_valid_fact = this.DevisForm.get('devisForms.0.date_valid_fact')?.value;
  newDevis.uid = this.authService.getuid();
  newDevis.datecreation = Date.now();
  newDevis.datemodification = Date.now();
  newDevis.devisItems = [];

  this.devisForms.controls.forEach((devisFormGroup, index) => {
    const devisItems = new DevisItems();
    this.calculertotal(index);

    devisItems.label = devisFormGroup.get('label')?.value;
    devisItems.references = devisFormGroup.get('references')?.value;
    devisItems.totalht = Number(devisFormGroup.get('totalht')?.value);
    devisItems.optiontva = devisFormGroup.get('optiontva')?.value;
    devisItems.tva = devisFormGroup.get('tva')?.value;
    devisItems.timbrefiscal = Number(devisFormGroup.get('timbrefiscal')?.value);
    devisItems.totalttc = Number(devisFormGroup.get('totalttc')?.value);
    newDevis.totalAmount += devisItems.totalttc
    if (newDevis.devisItems) { // Vérification si devisItems est défini
      newDevis.devisItems.push(devisItems);
    }
  });

  this.devisService.saveDevis(newDevis).then(() => {
    console.log("Devis enregistré avec succès :", newDevis);
    this.router.navigate(['/devis']);
  }).catch((error) => {
    console.error("Erreur lors de l'enregistrement du devis :", error);
    // Gestion de l'erreur ici (affichage à l'utilisateur, logging, etc.)
  });
}
  /*

  onSaveDevis() {
    this.calculertotal();
    const id = '';
    const idsociete =this.nomsocietedata.id;
    
    const idclient = this.DevisForm.get('idclient')?.value;
    const type_dev_fac = this.DevisForm.get('type_dev_fac')?.value;
    const numDevis = this.numdevisdata;
    
    const references = this.DevisForm.get('references')?.value;    
    const totalht : number= Number (this.DevisForm.get('totalht')?.value);
    const optiontva = this.DevisForm.get('optiontva')?.value;
    const tva = this.DevisForm.get('tva')?.value;
    const timbrefiscal : number= Number (this.DevisForm.get('timbrefiscal')?.value);
    const totalttc : number= Number (this.DevisForm.get('totalht')?.value);
    const date_valid_fact = this.DevisForm.get('date_valid_fact')?.value;



      const uid_ = this.authService.getuid();
      

      const datecreation = Date.now();
     

      const datemodification = Date.now();
      
      const newDevis = new Devis();

      newDevis.id = id;      
      newDevis.idsociete = idsociete; 
      newDevis.idclient = idclient;
      newDevis.type_dev_fac = type_dev_fac;  
      newDevis.numDevis = numDevis;
      newDevis.references = references;
      newDevis.totalht = totalht;
      newDevis.optiontva = optiontva;
      newDevis.tva = tva;
      newDevis.timbrefiscal = timbrefiscal;
      newDevis.totalttc = totalttc;
      newDevis.date_valid_fact = date_valid_fact;
      newDevis.uid = uid_;
      newDevis.datecreation = datecreation;
      newDevis.datemodification = datemodification;
      newDevis.label=this.selectedPerspective?.label

     this.devisForms.controls.forEach((devisFormGroup, index) => {
      this.calculertotal(index);
    
      newDevis.label = this.prespectivedata.label;
      newDevis.references = devisFormGroup.get('references')?.value;
      newDevis.totalht = Number(devisFormGroup.get('totalht')?.value);
      newDevis.optiontva = devisFormGroup.get('optiontva')?.value;
      newDevis.tva = devisFormGroup.get('tva')?.value;
      newDevis.timbrefiscal = Number(devisFormGroup.get('timbrefiscal')?.value);
      newDevis.totalttc = Number(devisFormGroup.get('totalttc')?.value);
      newDevis.date_valid_fact = devisFormGroup.get('date_valid_fact')?.value;
      newDevis.uid = this.authService.getuid();
      newDevis.datecreation = Date.now();
      newDevis.datemodification = Date.now();
      

    
    });

    this.devisService.saveDevis(newDevis);
    console.log(newDevis);
    this.router.navigate(['/devis']);
  }

  calculertotal(){

    let totalHTcalc = 0;

    const refrencescalc = this.DevisForm.get('references')?.value;
    console.log('ref',refrencescalc)
    for (let i = 0; i < refrencescalc.length; i++) {
      const quantite = refrencescalc[i].quantite;
      const prix_unitaire_HT = refrencescalc[i].prix_unitaire_HT;
      const montantHTcalc = Number(quantite * prix_unitaire_HT);
      this.DevisForm.get('references')?.get(`${i}`)?.get('montant_HT')?.setValue(montantHTcalc);
      totalHTcalc = totalHTcalc + montantHTcalc; 
   }

    const optiontva : number= Number (this.DevisForm.get('optiontva')?.value);
    const TVAcalc = Number (totalHTcalc * optiontva / 100);
    const totalTTCcalc=totalHTcalc + TVAcalc;
    
    
    this.DevisForm.controls['totalht'].setValue(totalHTcalc);
    this.DevisForm.controls['tva'].setValue(TVAcalc);
    if(this.typedevfac=='TND'){
      this.DevisForm.controls['timbrefiscal'].setValue(0.600);
    }else{
      this.DevisForm.controls['timbrefiscal'].setValue(0);
    }
    this.DevisForm.controls['totalttc'].setValue(totalTTCcalc);
  }

  
  */
 
  calculertotal(devisIndex:number ){
   const myDevisForm = this.devisForms.at(devisIndex) as FormGroup
   console.log("calculertotal methode", myDevisForm);

    let totalHTcalc = 0;

    const refrencescalc = myDevisForm.get('references')?.value;
    console.log('ref',refrencescalc)
    for (let i = 0; i < refrencescalc.length; i++) {
      const quantite = refrencescalc[i].quantite;
      const prix_unitaire_HT = refrencescalc[i].prix_unitaire_HT;
      const montantHTcalc = Number(quantite * prix_unitaire_HT);
      this.devisForms.at(devisIndex).get('references')?.get(`${i}`)?.get('montant_HT')?.setValue(montantHTcalc);
      totalHTcalc = totalHTcalc + montantHTcalc; 
   }

    const optiontva : number= Number (this.devisForms.at(devisIndex).get('optiontva')?.value);
    const TVAcalc = Number (totalHTcalc * optiontva / 100);
    const totalTTCcalc=totalHTcalc + TVAcalc;
 

    if (this.devisForms.at(devisIndex)) {
      (this.devisForms.at(devisIndex)as FormGroup).controls['totalht']?.setValue(totalHTcalc);
      this.devisForms.at(devisIndex).get('tva')?.setValue(TVAcalc);
      this.devisForms.at(devisIndex).get('totalttc')?.setValue(totalTTCcalc);

    } 
  }

  selectedOption(devisIndex: number) {
    console.log('selecteddeviseoption', devisIndex);

    this.calculertotal(devisIndex);
    const devisFormGroup = this.devisForms.at(devisIndex);
    const type_dev_fac = devisFormGroup.get('type_dev_fac')?.value;
    this.typedevfac = type_dev_fac;

   // devisFormGroup.patchValue({ timbrefiscal: '0.600' });
  }

  onBack() {
    this.router.navigate(['/devish']);
  }
  /* 
  onSelectPerspective(event: any) {
    const id = event.target.value;
    if (id != undefined) {
      this.selectedPerspective = this.prestationdata.find(p => p.id == id);

    }
  } */
  onSelectPerspective(event: any, devisIndex: number) {
    console.log('index', devisIndex);
    console.log('data', this.prestationdata);
    console.log('value', event.target.value);

    const id = event.target.value;
    if (id != undefined)
      this.selectedPerspective = this.prestationdata.find((p) => p.id == id);
    console.log('selectedPerspective', this.selectedPerspective);
    
    (this.devisForms.at(devisIndex) as FormArray).controls["label"].setValue(this.selectedPerspective?.label);


    const ref = this.getReferencesArray(devisIndex);
    this.selectedPerspective?.references?.forEach((element, index) => {
      ref.push(
        this.formBuilder.group({
          refid: [index],
          description: [element.description],
          quantite: [element.quantite],
          prix_unitaire_HT: [element.prix_unitaire_HT],
          montant_HT: [element.montant_HT],
        })
      );
    });
  }

  // Ajout d'une méthode pour obtenir le FormArray de références et vérifier son existence
  getReferencesArray(devisIndex: number): FormArray {
    return this.devisForms.at(devisIndex).get('references') as FormArray;
  }
}
