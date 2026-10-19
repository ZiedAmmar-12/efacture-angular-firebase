import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SocietesService } from 'src/app/services/societes.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-societe-edit',
  templateUrl: './societe-edit.component.html',
  styleUrls: ['./societe-edit.component.css']
})
export class SocieteEditComponent implements OnInit {

  societe : any;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  id: any;
  categoriedata:any;

  constructor(private route: ActivatedRoute,
    private societesService: SocietesService,
    private authService: AuthService,
    private router: Router,
    ) { }

    ngOnInit(): void {
      this.societesService.getAllcategorie().then(
        (data)=>{
          this.categoriedata=data;
        }
      );
        this.initForm();
        
       
    }
  SocieteFormedit= new FormGroup({
        idcategorie:new FormControl('',[Validators.required]),
        nomsociete: new FormControl('',[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
        telephone: new FormControl('',[Validators.required,Validators.pattern("^(\\+|[0]{2})?[1-9][0-9]{7,14}$|^[0-9]{8}$|^[0-9]{9}$")]),
        email: new FormControl('',[Validators.required,Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
        siret: new FormControl('',[Validators.required,Validators.pattern("^[0-9a-zA-Z]{14}$")]),
        adresse: new FormControl('',Validators.required),
        codepostale: new FormControl('',[Validators.required,Validators.pattern("^[0-9]{4,5}$")]),
        pays: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z\\s]{2,20}$")]),
        directeur: new FormControl('',[Validators.required,Validators.pattern("^[a-zA-Z\\s]{2,35}$")]),
        siteweb: new FormControl('',[Validators.required,Validators.pattern("^[w|W]{3}\.[0-9a-zA-Z]{1,50}\.[a-z]{2,4}$|^[0-9a-zA-Z]{1,50}\.[a-z]{2,4}$")]),
        type_dev_fac: new FormControl('',Validators.required),
        optiontva:new FormControl('',Validators.required),
        etat: new FormControl(false,Validators.required),
        nombanque: new FormControl('',[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
        codebanque: new FormControl('',[Validators.required,Validators.pattern("^[0-9a-zA-Z]{4}$")]),
        numcompte: new FormControl('',[Validators.required,Validators.pattern("^[0-9]{14}$")]),
        swift: new FormControl('',[Validators.required,Validators.pattern("^([0-9a-zA-Z]{8}$|[0-9a-zA-Z]{11}$)$")]),
      });

 

  
  


  initForm() {
    this.societesService.getsocieteById(this.route.snapshot.params["id"]).then(
      (result:any) =>{
        
        this.SocieteFormedit= new FormGroup({
          
          nomsociete: new FormControl(result.nomsociete,[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
          telephone: new FormControl(result.telephone,[Validators.required,Validators.pattern("^(\\+|[0]{2})?[1-9][0-9]{7,14}$|^[0-9]{8}$|^[0-9]{9}$")]),
          email: new FormControl(result.email,[Validators.required,Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
          siret: new FormControl(result.siret,[Validators.required,Validators.pattern("^[0-9a-zA-Z]{14}$")]),
          adresse: new FormControl(result.adresse,Validators.required),
          codepostale: new FormControl(result.codepostale,[Validators.required,Validators.pattern("^[0-9]{4,5}$")]),
          pays: new FormControl(result.pays,[Validators.required,Validators.pattern("^[a-zA-Z\\s]{2,20}$")]),
          directeur: new FormControl(result.directeur,[Validators.required,Validators.pattern("^[a-zA-Z\\s]{2,35}$")]),
          siteweb: new FormControl(result.siteweb, [Validators.required,Validators.pattern("^[w|W]{3}\.[0-9a-zA-Z]{1,50}\.[a-z]{2,4}$|^[0-9a-zA-Z]{1,50}\.[a-z]{2,4}$")]),
          type_dev_fac: new FormControl(result.type_dev_fac,Validators.required),
          optiontva:new FormControl(result.optiontva,Validators.required),
          etat: new FormControl(result.etat,Validators.required),
          idcategorie: new FormControl(result.idcategorie,Validators.required),
          nombanque: new FormControl(result.nombanque,[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
          codebanque: new FormControl(result.codebanque,[Validators.required,Validators.pattern("^[0-9a-zA-Z]{4}$")]),
          numcompte: new FormControl(result.numcompte,[Validators.required,Validators.pattern("^[0-9]{14}$")]),
          swift: new FormControl(result.swift,[Validators.required,Validators.pattern("^([0-9a-zA-Z]{8}$|[0-9a-zA-Z]{11}$)$")]),
          
        });
      }
    );
    

  }



  onUpdateSocieteedit(SocieteFormedit) {

      let societeData:any = {};
      societeData.idcategorie = SocieteFormedit.value.idcategorie; 
      societeData.nomsociete = SocieteFormedit.value.nomsociete;  
      societeData.telephone = SocieteFormedit.value.telephone;
      societeData.email = SocieteFormedit.value.email; 
      societeData.siret = SocieteFormedit.value.siret; 
      societeData.adresse = SocieteFormedit.value.adresse; 
      societeData.codepostale = SocieteFormedit.value.codepostale; 
      societeData.pays = SocieteFormedit.value.pays; 
      societeData.directeur = SocieteFormedit.value.directeur; 
      societeData.siteweb = SocieteFormedit.value.siteweb; 
      societeData.type_dev_fac = SocieteFormedit.value.type_dev_fac;
      societeData.optiontva = SocieteFormedit.value.optiontva;
      if(SocieteFormedit.value.etat == "true"){
        societeData.etat = true; 
      }else if(SocieteFormedit.value.etat == "false"){
        societeData.etat = false; 
      }
      societeData.nombanque = SocieteFormedit.value.nombanque; 
      societeData.codebanque = SocieteFormedit.value.codebanque; 
      societeData.numcompte = SocieteFormedit.value.numcompte; 
      societeData.swift = SocieteFormedit.value.swift; 



      societeData.datecreation = Date.now();
      societeData.datemodification = Date.now();

      let id = this.route.snapshot.params["id"];
      
    this.societesService.updateSocieteData(id,societeData);
    console.log(societeData);
    this.router.navigate(['/societes']);
  }


  

  onBack() {
    this.router.navigate(['/societes']);
  }

 
}