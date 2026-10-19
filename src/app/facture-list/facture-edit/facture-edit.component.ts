import { Component, OnInit } from '@angular/core';
import { FormGroup,FormBuilder, FormControl,Validators,FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturesService } from 'src/app/services/factures.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-facture-edit',
  templateUrl: './facture-edit.component.html',
  styleUrls: ['./facture-edit.component.css']
})
export class FactureEditComponent implements OnInit {

  facture : any;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  id: any;
  FactureFormedit!:FormGroup;
  numfacturedata: any;
  nomsocietedata: any;
  clientdata: any;
  societesService: any;
  typedevfac: any;
  
constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private facturesService: FacturesService,
              private authService: AuthService,
              private router: Router,
              ) { }

  
  ngOnInit(): void {

        this.facturesService.getAllclient().then(
          (data) => {
            this.clientdata= data; 
          }
        );
        this.initForm();  
  }


  initForm() {
    this.FactureFormedit = this.formBuilder.group( {
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

    this.facturesService.getfactureById(this.route.snapshot.params["id"]).then(
    
      (result:any) =>{

        this.FactureFormedit.patchValue({
          idsociete: result.idsociete,
          idclient: result.idclient,
          type_dev_fac: result.type_dev_fac,
          numfacture: result.numfacture,
          references: result.references,
          totalht:result.totalht,
          optiontva: result.optiontva,
          tva: result.tva,
          timbrefiscal: result.timbrefiscal,
          totalttc: result.totalttc,
          date_valid_fact: result.date_valid_fact          
        });
        this.typedevfac = result.type_dev_fac;
        result.references.forEach(x => {
          this.referencesforms.push(this.formBuilder.group(x));
        })
        

        const idsociete = result.idsociete;    
        this.facturesService.getnomsociete(idsociete).then(
          (data) => {
            this.nomsocietedata= data;        
          }
        );

        this.facturesService.getnumerofacturebyid(this.route.snapshot.params["id"]).then(
          (data) => {
            this.numfacturedata= data;
            console.log(data)
          }
         );

      }
    );
    
   

  }



  onUpdateFactureedit(FactureFormedit) {
    this.calculertotal();
      let factureData:any = {};

      factureData.idsociete = FactureFormedit.value.idsociete;  
      factureData.idclient = FactureFormedit.value.idclient;  
      factureData.type_dev_fac = FactureFormedit.value.type_dev_fac;
      factureData.numfacture = FactureFormedit.value.numfacture;
      factureData.references = FactureFormedit.value.references; 
      factureData.totalht = FactureFormedit.value.totalht;
      factureData.optiontva = FactureFormedit.value.optiontva;
      factureData.tva = FactureFormedit.value.tva; 
      factureData.timbrefiscal = FactureFormedit.value.timbrefiscal;
      factureData.totalttc = FactureFormedit.value.totalttc;
      factureData.date_valid_fact = FactureFormedit.value.date_valid_fact;
      

      factureData.datecreation = Date.now();
      factureData.datemodification = Date.now();

      let id = this.route.snapshot.params["id"];
      
    this.facturesService.updateFactureData(id,factureData);
    this.router.navigate(['/factures']);
  }

  get referencesforms() {
    
    console.log(this.FactureFormedit.value.references);
   
    return this.FactureFormedit.controls['references'] as FormArray;
   
  }

  addrefrenceFormGroup() {

    const newrefrencecontrol = this.formBuilder.group({
      refid:['',Validators.required],
      description:['',Validators.required],
      quantite:['',Validators.required],
      prix_unitaire_HT:['',Validators.required],
      montant_HT:['',Validators.required]
    });

    this.referencesforms.push(newrefrencecontrol);
    
    const refrencescalc = this.FactureFormedit.value.references;
    for (let i = 0; i < refrencescalc.length; i++) {
      this.FactureFormedit.get('references')?.get(`${i}`)?.get('refid')?.setValue(i+1);
    }

  }

  deletereferenceFormGroup(index: number) {
   this.referencesforms.removeAt(index);
   this.calculertotal();
  }

  calculertotal(){

    let totalHTcalc = 0;

    const refrencescalc = this.FactureFormedit.value.references;
    for (let i = 0; i < refrencescalc.length; i++) {
      const quantite = refrencescalc[i].quantite;
      const prix_unitaire_HT = refrencescalc[i].prix_unitaire_HT;
      const montantHTcalc = Number(quantite * prix_unitaire_HT);
      this.FactureFormedit.get('references')?.get(`${i}`)?.get('montant_HT')?.setValue(montantHTcalc);
      totalHTcalc = totalHTcalc + montantHTcalc; 
   }

    const optiontva : number= Number (this.FactureFormedit.value.optiontva);
    const TVAcalc : number= Number(totalHTcalc * optiontva / 100);
    const totalTTCcalc=totalHTcalc + TVAcalc;
    
    
    this.FactureFormedit.controls['totalht'].setValue(totalHTcalc);
    this.FactureFormedit.controls['tva'].setValue('30');
    if(this.typedevfac=='TND'){
      this.FactureFormedit.controls['timbrefiscal'].setValue(0.600);
    }else{
      this.FactureFormedit.controls['timbrefiscal'].setValue(0);
    }
    this.FactureFormedit.controls['totalttc'].setValue(totalTTCcalc);
    
  }

  selecteoptiontva(){
    this.calculertotal();
  }

  selecteddeviseoption(){
    const type_dev_fac = this.FactureFormedit.get('type_dev_fac')?.value;
    this.typedevfac = type_dev_fac;
    this.FactureFormedit.patchValue({timbrefiscal:'0.600'});
    this.calculertotal();
  }
  

  onBack() {
    this.router.navigate(['/factures']);
  }
}


