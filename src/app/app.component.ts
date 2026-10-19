import { Component } from '@angular/core';
import { FirebaseApp } from '@angular/fire/compat';
import { AuthService } from './services/auth.service';
import { UsersService } from './services/users.service';
import { ClientsService } from './services/clients.service';
import { SocietesService } from './services/societes.service';
import { FacturesService } from './services/factures.service';
import { TranslateService } from '@ngx-translate/core';

import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  HttpService: any;
  isAuth: boolean = false;


constructor(public readonly firebaseApp: FirebaseApp, private auth: AuthService,

              private users : UsersService, private clients : ClientsService, private societes : SocietesService, 
              
              private factures : FacturesService ,
              private translateService:TranslateService) {
                this.translateService.setDefaultLang('en');
                this.translateService.use(localStorage.getItem('lang') || 'en')
                
               }


              ngOnInit(): void {
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


  title = 'efacture';
  
}


