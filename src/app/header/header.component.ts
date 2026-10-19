import { Component, OnInit } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/auth';
import 'firebase/database';
import { AuthService } from '../services/auth.service';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  
onSignOut() {
throw new Error('Method not implemented.');
}

  isAuth: boolean = false;
  isActif: boolean = false;

  constructor(private authService: AuthService,private router: Router) {}

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

  

  Sedeconnecter(){
    this.authService.signOutUser();
  }

}
