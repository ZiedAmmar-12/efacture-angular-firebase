import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { sendPasswordResetEmail } from 'firebase/auth';
import * as firebase from 'firebase/compat';
import { AuthService } from 'src/app/services/auth.service';
import 'firebase/auth';
import 'firebase/database';
import {firstValueFrom} from 'rxjs';



@Component({
  selector: 'app-passwordforget',
  templateUrl: './passwordforget.component.html',
  styleUrls: ['./passwordforget.component.css']
})

export class PasswordforgetComponent implements OnInit {

  ResetPasswordForm!: FormGroup;
  errorMessage!: string;
  notifier: any;
  auth: any;
  email='';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private router: Router) {}
  
  ngOnInit(): void {
    
    this.initForm();
  }

  initForm(){
    this.ResetPasswordForm =this.formBuilder.group({
      email: ['',[Validators.required, Validators.email]],
      password: ['',[Validators.required]],
    

    });
  }
  

  resetPasswordForm() {
      const formvalue = this.ResetPasswordForm.value;
      const email = formvalue['email'];

    this.authService.resetPassword(email).then (
      () => {
        console.log("createNewUser");
        this.router.navigate(['/books']);
      },
      (error) => {
        this.errorMessage = error.message;
      }
    );
  }

  onBack() {
    this.router.navigate(['/signin']);
  }

  
  
    
}

