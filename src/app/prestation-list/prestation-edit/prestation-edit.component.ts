import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Prestation } from 'src/app/models/Prestation.model';
import { AuthService } from 'src/app/services/auth.service';
import { PrestationService } from 'src/app/services/prestation.service';

@Component({
  selector: 'app-prestation-edit',
  templateUrl: './prestation-edit.component.html',
  styleUrls: ['./prestation-edit.component.css']
})
export class PrestationEditComponent implements OnInit {
  prestation? :Prestation;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  id: any;
  PrestationFormedit!:FormGroup;
  numprestationdata: any;
  nomsocietedata: any;
  societedata:any;
 
  clientdata: any;
  societesService: any;
  typedevfac: any;
  PrestationForm: any;
  
constructor(private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private prestationService: PrestationService,
              private authService: AuthService,
              private router: Router,
              ) { }

  
  ngOnInit(): void {
    const idsociete = localStorage.getItem('idsocietestorage') || '' ;
    this.prestationService.getnomsociete(idsociete).then(
      (data) => {
        this.nomsocietedata= data;
        
      }
     );
        this.initForm()
    

  }
  
    initForm(){

    
      this.PrestationFormedit= this.formBuilder.group( {
      
        label: ['', Validators.required],
        references: this.formBuilder.array([]),
        totalht: ['',Validators.required],
        optiontva: ['',Validators.required],
        tva: ['',Validators.required],
        timbrefiscal: ['',Validators.required],
        totalttc: ['',Validators.required],
        
      });
     
    
  

    this.prestationService.getprestationById(this.route.snapshot.params["id"]).then(
    
      (result:any) =>{

        this.PrestationFormedit.patchValue({
        
          label: result.label,
          references: result.references,
          totalht:result.totalht,
          optiontva: result.optiontva,
          tva: result.tva,
          timbrefiscal: result.timbrefiscal,
          totalttc: result.totalttc,
              
        });
        console.log('prestation',result)
        result.references.forEach(x => {
          this.referencesforms.push(this.formBuilder.group(x));
        })
        
     console.log('prestation',result)

      }
    )

  }



  onUpdatePrestationedit(PrestationFormedit) {
    this.calculertotal();
      let prestationData:any = {};

      prestationData.label = PrestationFormedit.value.label;  
    
      prestationData.references = PrestationFormedit.value.references; 
      prestationData.totalht = PrestationFormedit.value.totalht;
      prestationData.optiontva = PrestationFormedit.value.optiontva;
      prestationData.tva = PrestationFormedit.value.tva; 
      prestationData.timbrefiscal = PrestationFormedit.value.timbrefiscal;
      prestationData.totalttc = PrestationFormedit.value.totalttc;
  
      

      prestationData.datecreation = Date.now();
      prestationData.datemodification = Date.now();

      let id = this.route.snapshot.params["id"];
      console.log(prestationData);
    this.prestationService.updatePrestationData(id,prestationData);
    this.router.navigate(['/prestation']);
  }

  get referencesforms() {
    
    console.log(this.PrestationFormedit.value.references);
   
    return this.PrestationFormedit.controls['references'] as FormArray;
   
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
    
    const refrencescalc = this.PrestationFormedit.value.references;
    for (let i = 0; i < refrencescalc.length; i++) {
      this.PrestationFormedit.get('references')?.get(`${i}`)?.get('refid')?.setValue(i+1);
    }

  }

  deletereferenceFormGroup(index: number) {
   this.referencesforms.removeAt(index);
   this.calculertotal();
  }

  calculertotal(){

    let totalHTcalc = 0;

    const refrencescalc = this.PrestationFormedit.value.references;
    for (let i = 0; i < refrencescalc.length; i++) {
      const quantite = refrencescalc[i].quantite;
      const prix_unitaire_HT = refrencescalc[i].prix_unitaire_HT;
      const montantHTcalc = Number(quantite * prix_unitaire_HT);
      this.PrestationFormedit.get('references')?.get(`${i}`)?.get('montant_HT')?.setValue(montantHTcalc);
      totalHTcalc = totalHTcalc + montantHTcalc; 
   }

    const optiontva : number= Number (this.PrestationFormedit.value.optiontva);
    const TVAcalc : number= Number(totalHTcalc * optiontva / 100);
    const totalTTCcalc=totalHTcalc + TVAcalc;
    
    
    this.PrestationFormedit.controls['totalht'].setValue(totalHTcalc);
    this.PrestationFormedit.controls['tva'].setValue('30');
    if(this.typedevfac=='TND'){
      this.PrestationFormedit.controls['timbrefiscal'].setValue(0.600);
    }else{
      this.PrestationFormedit.controls['timbrefiscal'].setValue(0);
    }
    this.PrestationFormedit.controls['totalttc'].setValue(totalTTCcalc);
    
  }

  selecteoptiontva(){
    this.calculertotal();
  }

  selecteddeviseoption(){
    const type_dev_fac = this.PrestationFormedit.get('type_dev_fac')?.value;
    this.typedevfac = type_dev_fac;
    this.PrestationFormedit.patchValue({timbrefiscal:'0.600'});
    this.calculertotal();
  }
  

  onBack() {
    this.router.navigate(['/prestaion']);
  }

}


