import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DevisService } from 'src/app/services/devis.service';
@Component({
  selector: 'app-devis-edit-hors-societe',
  templateUrl: './devis-edit-hors-societe.component.html',
  styleUrls: ['./devis-edit-hors-societe.component.css']
})
export class DevisEditHorsSocieteComponent implements OnInit {

  devis : any;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  id: any;
  DevisFormedit!:FormGroup;
  numdevisdata: any;
  nomsocietedata: any;
  societedata:any;
 
  clientdata: any;
  societesService: any;
  typedevfac: any;
  
constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private devisService: DevisService,
              private authService: AuthService,
              private router: Router,
              ) { }

  
  ngOnInit(): void {

        this.devisService.getAllclient().then(
          (data) => {
            this.clientdata= data; 
          }
        );
         
        this.devisService.getAllsociete().then(
          (data) => {
            this.societedata= data; 
          }
        );
        this.initForm();
  }


  initForm() {
    this.DevisFormedit = this.formBuilder.group( {
      idsociete: [''], 
      idclient: ['', Validators.required],
      type_dev_fac: ['', Validators.required],
      numDevis: [''],
      references: this.formBuilder.array([]),
      totalht: ['',Validators.required],
      optiontva: ['',Validators.required],
      tva: ['',Validators.required],
      timbrefiscal: ['',Validators.required],
      totalttc: ['',Validators.required],
      date_valid_fact: ['', Validators.required],
    });

    this.devisService.getdevisById(this.route.snapshot.params["id"]).then(
    
      (result:any) =>{

        this.DevisFormedit.patchValue({
          idsociete: result.idsociete,
          idclient: result.idclient,
          type_dev_fac: result.type_dev_fac,
          numDevis: result.numDevis,
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
        this.devisService.getnomsociete(idsociete).then(
          (data) => {
            this.nomsocietedata= data;        
          }
        );

        this.devisService.getnumerodevisbyid(this.route.snapshot.params["id"]).then(
          (data) => {
            this.numdevisdata= data;
            console.log(data)
          }
         );

      }
    );
    
   

  }



  onUpdateDevisedit(DevisFormedit) {
    this.calculertotal();
      let devisData:any = {};

      devisData.idsociete = DevisFormedit.value.idsociete;  
      devisData.idclient = DevisFormedit.value.idclient;  
      devisData.type_dev_fac = DevisFormedit.value.type_dev_fac;
      devisData.numDevis = DevisFormedit.value.numDevis;
      devisData.references = DevisFormedit.value.references; 
      devisData.totalht = DevisFormedit.value.totalht;
      devisData.optiontva = DevisFormedit.value.optiontva;
      devisData.tva = DevisFormedit.value.tva; 
      devisData.timbrefiscal = DevisFormedit.value.timbrefiscal;
      devisData.totalttc = DevisFormedit.value.totalttc;
      devisData.date_valid_fact = DevisFormedit.value.date_valid_fact;
      

      devisData.datecreation = Date.now();
      devisData.datemodification = Date.now();

      let id = this.route.snapshot.params["id"];
      
    this.devisService.updateDevisData(id,devisData);
    this.router.navigate(['/devish']);
  }

  get referencesforms() {
    
    console.log(this.DevisFormedit.value.references);
   
    return this.DevisFormedit.controls['references'] as FormArray;
   
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
    
    const refrencescalc = this.DevisFormedit.value.references;
    for (let i = 0; i < refrencescalc.length; i++) {
      this.DevisFormedit.get('references')?.get(`${i}`)?.get('refid')?.setValue(i+1);
    }

  }

  deletereferenceFormGroup(index: number) {
   this.referencesforms.removeAt(index);
   this.calculertotal();
  }

  calculertotal(){

    let totalHTcalc = 0;

    const refrencescalc = this.DevisFormedit.value.references;
    for (let i = 0; i < refrencescalc.length; i++) {
      const quantite = refrencescalc[i].quantite;
      const prix_unitaire_HT = refrencescalc[i].prix_unitaire_HT;
      const montantHTcalc = Number(quantite * prix_unitaire_HT);
      this.DevisFormedit.get('references')?.get(`${i}`)?.get('montant_HT')?.setValue(montantHTcalc);
      totalHTcalc = totalHTcalc + montantHTcalc; 
   }

    const optiontva : number= Number (this.DevisFormedit.value.optiontva);
    const TVAcalc : number= Number(totalHTcalc * optiontva / 100);
    const totalTTCcalc=totalHTcalc + TVAcalc;
    
    
    this.DevisFormedit.controls['totalht'].setValue(totalHTcalc);
    this.DevisFormedit.controls['tva'].setValue('30');
    if(this.typedevfac=='TND'){
      this.DevisFormedit.controls['timbrefiscal'].setValue(0.600);
    }else{
      this.DevisFormedit.controls['timbrefiscal'].setValue(0);
    }
    this.DevisFormedit.controls['totalttc'].setValue(totalTTCcalc);
    
  }

  selecteoptiontva(){
    this.calculertotal();
  }

  selecteddeviseoption(){
    const type_dev_fac = this.DevisFormedit.get('type_dev_fac')?.value;
    this.typedevfac = type_dev_fac;
    this.DevisFormedit.patchValue({timbrefiscal:'0.600'});
    this.calculertotal();
  }
  

  onBack() {
    this.router.navigate(['/devis']);
  }

}