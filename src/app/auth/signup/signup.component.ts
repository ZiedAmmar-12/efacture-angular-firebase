import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { telephone } from 'ngx-bootstrap-icons';
import { AuthService } from 'src/app/services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signUpForm!: FormGroup;
  errorMessage!: string;
  email='';
  password='';
  userName='';
  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private translateService:TranslateService,
              private router: Router) {}
  
  ngOnInit(): void {
    this.initForm();
  }

  initForm(){
    this.signUpForm =this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required ]],
      userName: ['',[Validators.required ]],

    });
  }

  onBack() {
    this.router.navigate(['/signin']);
  }
  //userName
  
  signUpOnsubmit(){
    const formvalue = this.signUpForm.value;
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

  }

  lang:string ='';

  

 

  ChangeLang(lang:any){
    const selectedLanguage = lang.target.value;
//alert(selectedLanguage)
   localStorage.setItem('lang',selectedLanguage);

   this.translateService.use(selectedLanguage);

  } 


}
