import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from 'src/app/models/Client.model';
import { ClientsService } from 'src/app/services/clients.service';
import { AuthService } from 'src/app/services/auth.service';
import { timeStamp } from 'console';

@Component({
  selector: 'app-client-form',
  templateUrl: './client-form.component.html',
  styleUrls: ['./client-form.component.css']
})
export class ClientFormComponent {
  
  ClientForm!: FormGroup;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  datecreation!:string;
  datemodification!:string;
 
  constructor(private formBuilder: FormBuilder,
              private clientsService: ClientsService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }            
  
  initForm() {
    this.ClientForm = this.formBuilder.group( {
      nomclient: ['',[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]],
      telephone: ['',[Validators.required,Validators.pattern("^(\\+|[0]{2})?[1-9][0-9]{7,14}$|^[0-9]{8}$|^[0-9]{9}$")]],
      email: ['',[Validators.required,Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      siren: ['',[Validators.required,Validators.pattern("^(\\+|[0]{2})?[1-9][0-9]{7,14}$|^[0-9]{8}$|^[0-9]{9}$")]],
      nomgerant:['',[Validators.required,Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]],
      adresse: ['', Validators.required],


    });
  }

  get nomclient() {
    return this.ClientForm.get('nomclient');
  }

  get telephone() {
    return this.ClientForm.get('telephone');
  }

  get email() {
    return this.ClientForm.get('email');
  }

  get siren() {
    return this.ClientForm.get('siren');
  }

  get adresse() {
    return this.ClientForm.get('adresse');
  }

  onSaveClient() {
    
    const id ='';
    const nomclient = this.ClientForm.get('nomclient')?.value;
    const telephone : number= Number (this.ClientForm.get('telephone')?.value);
    const email = this.ClientForm.get('email')?.value;
    const siren : number= Number (this.ClientForm.get('siren')?.value);
    const nomgerant = this.ClientForm.get('nomgerant')?.value;
    const adresse = this.ClientForm.get('adresse')?.value;


  
      const uid_ = this.authService.getuid();
      console.log('ixi'+uid_);

      const datecreation = Date.now();
      console.log('ixi'+datecreation);

      const datemodification = Date.now();
      console.log('ixi'+datemodification);
   
      const newClient = new Client();

      newClient.id = id;
      newClient.nomclient = nomclient;
      newClient.telephone = telephone;
      newClient.email = email;
      newClient.siren = siren;
      newClient.nomgerant = nomgerant;
      newClient.adresse = adresse;
      newClient.uid = uid_;
      newClient.datecreation = datecreation;
      newClient.datemodification = datemodification;

  
    this.clientsService.saveClients(newClient);
    this.router.navigate(['/clients']);
  }
  onBack() {
    this.router.navigate(['/clients']);
  }
  
}



