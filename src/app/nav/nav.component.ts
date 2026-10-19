import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/database';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
 
  onSignOut() {
  throw new Error('Method not implemented.');
  }
  
    isAuth: boolean = false;
    isActif: boolean = false;
  
    constructor(private translateService:TranslateService,
      private authService: AuthService) {}
  
    ngOnInit(): void {
      this.lang = localStorage.getItem('lang') || 'en';
      firebase.auth().onAuthStateChanged(
        (user: any) => {
          if (user) {
            this.isAuth = true;
          } else {
            this.isAuth = false;
          }
        }
      );
    }
  
    
  
    Sedeconnecter(){
      this.authService.signOutUser();
    }
    
  lang:string ='';

  

 

  ChangeLang(lang:any){
    const selectedLanguage = lang.target.value;
//alert(selectedLanguage)
   localStorage.setItem('lang',selectedLanguage);

   this.translateService.use(selectedLanguage);

  }
}
