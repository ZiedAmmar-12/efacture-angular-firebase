import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Societe } from 'src/app/models/Societe.model';
import { SocietesService } from 'src/app/services/societes.service';
import { AuthService } from 'src/app/services/auth.service';
import { log } from 'console';


@Component({
  selector: 'app-societe-form',
  templateUrl: './societe-form.component.html',
  styleUrls: ['./societe-form.component.css']
})
export class SocieteFormComponent {

  SocieteForm!: FormGroup;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!: string;
  datecreation!: string;
  datemodification!: string;
  etat!: boolean;
  categoriedata: any;
  
  selectedFile: any = null;

  constructor(private formBuilder: FormBuilder,
    private societesService: SocietesService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {
    this.societesService.getAllcategorie().then(
      (data) => {
        this.categoriedata = data;
      }
    );
    this.initForm();
  }

  initForm() {

    this.SocieteForm = this.formBuilder.group({
      idcategorie: ['', Validators.required],
      nomsociete: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]],
      telephone: ['', [Validators.required, Validators.pattern("^(\\+|[0]{2})?[1-9][0-9]{7,14}$|^[0-9]{8}$|^[0-9]{9}$")]],
      email: ['', [Validators.required, Validators.email, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      siret: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z]{14}$")]],
      adresse: ['', Validators.required],
      codepostale: ['', [Validators.required, Validators.pattern("^[0-9]{4,5}$")]],
      pays: ['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]{2,20}$")]],
      directeur: ['', [Validators.required, Validators.pattern("^[a-zA-Z\\s]{2,35}$")]],
      siteweb: ['', [Validators.required, Validators.pattern("^[w|W]{3}\.[0-9a-zA-Z]{1,50}\.[a-z]{2,4}$|^[0-9a-zA-Z]{1,50}\.[a-z]{2,4}$")]],
      type_dev_fac: ['', Validators.required],
      optiontva: ['', Validators.required],
      imageUrl: ['', Validators.required],

      etat: ['', Validators.required],
      nombanque: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z\\s]{2,50}$")]],
      codebanque: ['', [Validators.required, Validators.pattern("^[0-9a-zA-Z]{4}$")]],
      numcompte: ['', [Validators.required, Validators.pattern("^[0-9]{14}$")]],
      swift: ['', [Validators.required, Validators.pattern("^([0-9a-zA-Z]{8}$|[0-9a-zA-Z]{11}$)$")]]
    });

  }
  get idcategorie() {
    return this.SocieteForm.get('idcategorie');
  }
  get nomsociete() {
    return this.SocieteForm.get('nomsociete');
  }
  get imageUrl() {
    return this.SocieteForm.get('imageUrl');
  }

  get telephone() {
    return this.SocieteForm.get('telephone');
  }

  get email() {
    return this.SocieteForm.get('email');
  }

  get siret() {
    return this.SocieteForm.get('siret');
  }

  get adresse() {
    return this.SocieteForm.get('adresse');
  }

  get codepostale() {
    return this.SocieteForm.get('codepostale');
  }

  get pays() {
    return this.SocieteForm.get('pays');
  }

  get directeur() {
    return this.SocieteForm.get('directeur');
  }

  get siteweb() {
    return this.SocieteForm.get('siteweb');
  }

  get optiontva() {
    return this.SocieteForm.get('optiontva');
  }

  get type_dev_fac() {
    return this.SocieteForm.get('type_dev_fac');
  }

  get nombanque() {
    return this.SocieteForm.get('nombanque');
  }

  get codebanque() {
    return this.SocieteForm.get('codebanque');
  }

  get numcompte() {
    return this.SocieteForm.get('numcompte');
  }

  get swift() {
    return this.SocieteForm.get('swift');
  }



  async onSaveSociete() {

    const id = '';
    const idcategorie = this.SocieteForm.get('idcategorie')?.value;
    const nomsociete = this.SocieteForm.get('nomsociete')?.value;
    const telephone: number = Number(this.SocieteForm.get('telephone')?.value);
    const email = this.SocieteForm.get('email')?.value;
    const siret = this.SocieteForm.get('siret')?.value;
    const adresse = this.SocieteForm.get('adresse')?.value;
    const codepostale = this.SocieteForm.get('codepostale')?.value;
    const pays = this.SocieteForm.get('pays')?.value;
    const directeur = this.SocieteForm.get('directeur')?.value;
    const siteweb = this.SocieteForm.get('siteweb')?.value;
    const type_dev_fac = this.SocieteForm.get('type_dev_fac')?.value;
    const optiontva = this.SocieteForm.get('optiontva')?.value;


    if (this.SocieteForm.get('etat')?.value == "true") {
      this.etat = true;
    } else {
      this.etat = false;
    }

    const nombanque = this.SocieteForm.get('nombanque')?.value;
    const codebanque = this.SocieteForm.get('codebanque')?.value;
    const numcompte: number = Number(this.SocieteForm.get('numcompte')?.value);
    const swift = this.SocieteForm.get('swift')?.value;

    const uid_ = this.authService.getuid();
    console.log('ixi' + uid_);

    const datecreation = Date.now();
    console.log('ixi' + datecreation);

    const datemodification = Date.now();
    console.log('ixi' + datemodification);

    const newSociete = new Societe();
    newSociete.id = id;
    newSociete.idcategorie = idcategorie;
    newSociete.nomsociete = nomsociete;
    newSociete.telephone = telephone;
    newSociete.email = email;
    newSociete.siret = siret;
    newSociete.adresse = adresse;
    newSociete.codepostale = codepostale;
    newSociete.pays = pays;
    newSociete.directeur = directeur;
    newSociete.siteweb = siteweb;
    newSociete.type_dev_fac = type_dev_fac;
    newSociete.optiontva = optiontva;
    newSociete.etat = this.etat;
    newSociete.nombanque = nombanque;
    newSociete.codebanque = codebanque;
    newSociete.numcompte = numcompte;
    newSociete.swift = swift;
    newSociete.uid = uid_;
    newSociete.datecreation = datecreation;
    newSociete.datemodification = datemodification;
    //newSociete.imageUrl = this.imageUrl;

    
    // if file exist 
    if (this.selectedFile) {
      const imgUrl = await this.societesService.uploadImagetoStorage(this.selectedFile);
      console.log('Uploaded Image URL:', imgUrl);

      newSociete.imageUrl = imgUrl;

    }

    this.societesService.saveSocietes(newSociete);
    this.router.navigate(['/societes']);
  }
  onBack() {
    this.router.navigate(['/societes']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
  console.log(file);
    this.selectedFile =file;
    console.log('Uploaded Image URL:',  this.selectedFile?.name);

  }

  async uploadImage(): Promise<void> {
    if (this.selectedFile?.length) {
      console.error('file selected!');
      // Handle the uploaded image URL as per your requirement
    } else {
      console.error('No file selected!');
    }
  }
}
