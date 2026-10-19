import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
resetPassword() {
throw new Error('Method not implemented.');
}

  signInForm!: FormGroup;
  errorMessage!: string;


  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private translateService:TranslateService,
              private router: Router) {}
  
  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.signInForm =this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required]],

    });
  }
  

  onSubmit(){
    const formvalue = this.signInForm.value;
      const email = formvalue['email'];
      const password = formvalue['password'];
 
    this.authService.signInUserwithLoginpassword(email, password).then (
      () =>  this.authService.fetchUserStatus(email).then((isActif)=>{
        console.log('userStatus is actif ',isActif)
        if(isActif)
        this.router.navigate(['/users'])
      else{
        this.errorMessage = this.translateService.instant('your account is not authorized please contact admin');

        this.authService.signOutUser()
      }
      })

      ,
      (error) => {
        this.errorMessage = error.code;
        var errorCode = error.code;
            var errorMessage = error.message;
            if ( errorCode == 'email-déja utilise' ) {
                this.errorMessage="this.translateService.instant('Vous avez déjà un compte avec cette adresse e-mail.')";
            } else if ( errorCode == 'email-invalide' ) {
                this.errorMessage="this.translateService.instant('Veuillez saisir un email valide')";
            } else if ( errorCode == 'mot de passe faible' ) {
                this.errorMessage="Le mot de passe est trop faible.";
            } else if ( errorCode == 'wrong-password' ) {
                this.errorMessage="mauvais mot de passe";
              } else if ( errorCode == 'trop de requêtes' ) {
                this.errorMessage=" Veuillez réessayer dans 34 secondes.";
            } else {
                this.errorMessage=error.message;
            }
            console.log(error);
        
      }
    ); 
  

  }

  
  
  
  SeconnecterwithGoogle(){
    this.authService.signInUserGoogle().then(
      () => {
        console.log("connexion reussie !!");
      
        this.router.navigate(['/users']);
    }
    ).catch(
        (error) => {
        this.errorMessage = error.message;
        console.log(error.message+"connexion error !!");
       }
    );
      }  
      lang:string ='';

  

 

  ChangeLang(lang:any){
    const selectedLanguage = lang.target.value;
//alert(selectedLanguage)
   localStorage.setItem('lang',selectedLanguage);

   this.translateService.use(selectedLanguage);

  } 
     
    
  }
