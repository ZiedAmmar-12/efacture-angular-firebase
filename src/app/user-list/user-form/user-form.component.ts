import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators,FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User.model';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { timeStamp } from 'console';


@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent {

  UserForm!: FormGroup;
  errorMessage!: string;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  datecreation!:string;
  datemodification!:string;
  etat!:boolean;

  constructor(private formBuilder: FormBuilder,
              private usersService: UsersService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.initForm();
  }            
  
  initForm() {
    this.UserForm = this.formBuilder.group( {
      nomdutilisateur: ['',[Validators.required,Validators.pattern("^[a-zA-Z\\s]{3,35}$")]],
      gid: ['', Validators.required],
      email: ['', [Validators.required, Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      etat: ['', Validators.required],
      telephone: [
        '',
        [
          Validators.required,
          Validators.maxLength(10),
          Validators.pattern(/^(?:\+?(216|33))?\d{8}$/) // Regex pour numéros tunisiens ou français
        ]
      ],
      password: ['', Validators.required]

    });
  }

  get nomdutilisateur() {
    return this.UserForm.get('nomdutilisateur');
  }

  get gid() {
    return this.UserForm.get('gid');
  }

  get email() {
    return this.UserForm.get('email');
  }
  
  get telephone() {
    return this.UserForm.get('telephone');
  }
  get password() {
    return this.UserForm.get('password');
  }

onSaveUser() {
    
    const id = '';
    const nomdutilisateur = this.UserForm.get('nomdutilisateur')?.value;
    const gid : number= Number (this.UserForm.get('gid')?.value);
    const email = this.UserForm.get('email')?.value;
    const password = this.UserForm.get('password')?.value;

    if (this.UserForm.get('etat')?.value== "true") {
      this.etat =true;
    } else {
      this.etat =false;
    }
    
    const telephone = this.UserForm.get('telephone')?.value;


      const uid_ = this.authService.getuid();
      console.log('ixi'+uid_);

      const datecreation = Date.now();
      console.log('ixi'+datecreation);

      const datemodification = Date.now();
      console.log('ixi'+datemodification);
   
      const newUser = new User(); 
      newUser.id = id;
      newUser.nomdutilisateur = nomdutilisateur;
      newUser.gid = gid;
      newUser.email = email;
      newUser.etat = this.etat;
      newUser.telephone =telephone; 
      newUser.uid = uid_;
      newUser.datecreation = datecreation; 
      newUser.datemodification = datemodification;


    this.authService.createNewUserWithEmailAndPasswordByAdmin(email,password)
    .then(()=>this.usersService.saveUsers(newUser)).finally(    this.onBack)
    this.router.navigate(['/users']);
    


  }
  //sign up  
  /*signUpOnsubmit(){
    const formvalue = this.UserForm.value;
      const email = formvalue['email'];
      const password = formvalue['password'];
      const userName=formvalue['userName'];
      const etat=formvalue['etat'];
      const telephone=formvalue['telephone'];
    console.log("email:"+email);
    this.authService.createNewUser(email, password,userName).then (
      () => this.authService.fetchUserStatus(email).then((isUserActif)=>{

        if(isUserActif)
        this.router.navigate(['/users'])
      else{
          this.errorMessage ="votre compte n'est pas autoriser vouillez contacter administrateur"
          this.authService.signOutUser()
  }}),
      (error) => {
        this.errorMessage = error.message;
      }
    );

  }*/
  onBack() {
    this.router.navigate(['/users']);
  }
  
  
}