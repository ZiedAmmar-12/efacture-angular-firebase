import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from 'src/app/services/clients.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-client-edit',
  templateUrl: './client-edit.component.html',
  styleUrls: ['./client-edit.component.css']
})
export class ClientEditComponent implements OnInit {


  client : any;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  id: any;
  ClientFormedit= new FormGroup({

        nomclient: new FormControl('',[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
        telephone: new FormControl('',[Validators.required,Validators.pattern("^(\\+|[0]{2})?[1-9][0-9]{7,14}$|^[0-9]{8}$|^[0-9]{9}$")]),
        email: new FormControl('',[Validators.required,Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
        siren: new FormControl('',[Validators.required,Validators.pattern("^[0-9a-zA-Z]{14}$")]),
        nomgerant: new FormControl('',[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
        adresse: new FormControl(''),
  });

  constructor(private route: ActivatedRoute,
              private clientsService: ClientsService,
              private authService: AuthService,
              private router: Router,
              ) { }

  
  ngOnInit(): void {
    
      this.initForm();
        
  }

  initForm() {
    this.clientsService.getclientById(this.route.snapshot.params["id"]).then(
      (result:any) =>{
        console.log('test');
        console.log(result.etat);
        console.log('test');
        this.ClientFormedit= new FormGroup({
          nomclient: new FormControl(result.nomclient,[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
          telephone: new FormControl(result.telephone,[Validators.required,Validators.pattern("^(\\+|[0]{2})?[1-9][0-9]{7,14}$|^[0-9]{8}$|^[0-9]{9}$")]),
          email: new FormControl(result.email,[Validators.required,Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
          siren: new FormControl(result.siren,[Validators.required,Validators.pattern("^[0-9a-zA-Z]{14}$")]),
          nomgerant: new FormControl(result.nomgerant,[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]),
          adresse: new FormControl(result.adresse),

        });
      }
    );
    

  }



  onUpdateClientedit(ClientFormedit) {

      let clientData:any = {};

        clientData.nomclient = ClientFormedit.value.nomclient;

        clientData.telephone = ClientFormedit.value.telephone;

        clientData.email = ClientFormedit.value.email; 

        clientData.siren = ClientFormedit.value.siren;

        clientData.nomgerant = ClientFormedit.value.nomgerant;

        clientData.adresse = ClientFormedit.value.adresse;
        

        clientData.datecreation = Date.now();
        clientData.datemodification = Date.now();

        let id = this.route.snapshot.params["id"];
      
      this.clientsService.updateClientData(id,clientData);
      this.router.navigate(['/clients']);
  }


  

  onBack() {
    this.router.navigate(['/clients']);
  }

}
