import { Component ,OnInit,Pipe} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Devis } from 'src/app/models/Devis.model';
import { Prespective } from 'src/app/models/Prespective.model';
import { Prestation, References } from 'src/app/models/Prestation.model';
import { AuthService } from 'src/app/services/auth.service';
import { DevisService } from 'src/app/services/devis.service';
import { PrespectivesService } from 'src/app/services/prespectives.service';
import { PrestationService } from 'src/app/services/prestation.service';

@Component({
  selector: 'app-formulaire',
  templateUrl: './formulaire.component.html',
  styleUrls: ['./formulaire.component.css']
})
export class FormulaireComponent implements OnInit{
  PrespectiveForm!: FormGroup;
  PrestationForm!:FormGroup;
  devis : any;
  id: any;
  DevisForm!: FormGroup;
  DevisPrestationForm!: FormGroup;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  datecreation!:string;
  datemodification!:string;
  keynumDevis: string='';
  numdevisdata: any;
  nomsocietedata: any;
  clientdata: any;
  prespectivedata: any;
  prestationdata: any;
  societesService: any
  typedevfac: any;
  selectedPerspective:Prespective | undefined
  selectedPerstation:Prespective | undefined
  categoriedata: any;

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private devisService: DevisService,
              private authService: AuthService,
              private prespectivesService: PrespectivesService,
              private prestationService :PrestationService,
              private router: Router) { }

  ngOnInit(): void {
    this.prespectivesService.getAllcategorie().then(
      (data) => {
        this.categoriedata = data;
      }
    );
    const idsociete = localStorage.getItem('idsocietestorage') || '' ;
    
    this.devisService.getnumerodevis(idsociete).then(
      (data) => {
        this.numdevisdata= data;
       
      }
     );

    
    this.devisService.getnomsociete(idsociete).then(
      (data) => {
        this.nomsocietedata= data;
        
      }
     );

    this.devisService.getAllclient().then(
      (data) => {
        this.clientdata= data; 
      }
    );
    this.devisService.getAllprespectives().then(
      (data) => {
        this.prespectivedata= data; 
        console.log(this.prespectivedata)
       
      }
    );
    this.devisService.getAllprestations().then(
      (data) => {
        this.prestationdata= data; 
        console.log(this.prestationdata)
       
      }
    );

    this.initForm();
  }            
  initForm() {

    

    const idsociete = localStorage.getItem('idsocietestorage') || '' ;
    
    this.DevisForm = this.formBuilder.group( {
      idsociete: [''], 
      idclient: ['', Validators.required],
      type_dev_fac: ['', Validators.required],
      numdevis: [''],
      
      references: this.formBuilder.array([]),
      totalht: ['',Validators.required],
      optiontva: ['',Validators.required],
      tva: ['',Validators.required],
      timbrefiscal: ['',Validators.required],
      totalttc: ['',Validators.required],
      date_valid_fact: ['', Validators.required],
      devisList: this.formBuilder.array([]),

    });
   
  }

  get idsociete() {
    return this.DevisForm.get('idsociete');
  }

  get idclient() {
    return this.DevisForm.get('idclient');
  }

  get numDevis() {
    console.log('numDevis'); 
    console.log(this.DevisForm.get('numDevis'));
    return this.DevisForm.get('numDevis');
  }

  get date_valid_fact() {
    return this.DevisForm.get('date_valid_fact');
  }

  get type_dev_fac() {
    return this.DevisForm.get('type_dev_fac');
  }
  get label() {
    return this.DevisForm.get('label');
  }
  get referencesforms() {
    return this.DevisForm.get("references") as FormArray;
  }
  selecteoptiontva(){
    this.calculertotal();
  }
  prestationListArray() {
    return this.DevisForm.get("prestationList") as FormArray;
  }
  addPrestation() {
    this.prestationListArray().push(this.initForm());
  }

  addDetailsFormGroup() {

    const newrefrencecontrol = this.formBuilder.group({
      label:['',Validators.required],
     references: this.formBuilder.array([]),
    });

    this.referencesforms.push(newrefrencecontrol);
    
    const refrencescalc = this.DevisForm.get('references')?.value;
    for (let i = 0; i < refrencescalc.length; i++) {
      this.DevisForm.get('references')?.get(`${i}`)?.get('refid')?.setValue(i+1);
    }

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
    
    const refrencescalc = this.DevisForm.get('references')?.value;
    for (let i = 0; i < refrencescalc.length; i++) {
      this.DevisForm.get('references')?.get(`${i}`)?.get('refid')?.setValue(i+1);
    }

  }
  addDevisForm(){
    const newrefrencecontrol = this.formBuilder.group({
      refid:[1,Validators.required],
      description:['',Validators.required],
      quantite:[1,Validators.required],
      prix_unitaire_HT:['',Validators.required],
      montant_HT:['',Validators.required]
    });

  }
 
  deletereferenceFormGroup(index: number) {
    this.referencesforms.removeAt(index);
    this.calculertotal();
  }

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


    

    this.devisService.saveDevis(newDevis);
    console.log(newDevis);
    this.router.navigate(['/devish']);
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

  

  selecteddeviseoption(){
    const type_dev_fac = this.DevisForm.get('type_dev_fac')?.value;
    this.typedevfac = type_dev_fac;
    this.DevisForm.patchValue({timbrefiscal:'0.600'});
    this.calculertotal();
  }
  
  onBack() {
    this.router.navigate(['/devish']);
  }
  onSelectPerspective(event:any){
    console.log("index",event.target.value)
    console.log("data",this.prestationdata)
    const id= event.target.value
    if(id!= undefined)

    this.selectedPerspective=this.prestationdata.find(p=> p.id==id)
    console.log("selectedPerspective",this.selectedPerspective)

  }
 


}
