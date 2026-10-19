import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {
  user : any;
  fileIsUploading = false;
  fileUrl!: string;
  fileUploaded = false;
  uid_!:string;
  id: any;
  UserFormedit= new FormGroup({
        nomdutilisateur: new FormControl('',
        [
          Validators.required,
          Validators.pattern("^[a-zA-Z\\s]{3,35}$")
        ]),
        gid: new FormControl(22, Validators.required),
        email: new FormControl('',[Validators.required, Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
        etat: new FormControl(false,Validators.required),
        telephone: new FormControl('', Validators.required),
      });

  constructor(private route: ActivatedRoute,
              private usersService: UsersService,
              private authService: AuthService,
              private router: Router,
              ) { }

  
  ngOnInit(): void {
     // this.getUseredit(this.route.snapshot.params["id"]);
      
      this.initForm();
      
     
  }

  /*getUseredit(id: number): void {
    this.usersService.getUserbyid(+id).then(
      (data) => {
       this.user = data;
      }
     );
  }*/

  initForm() {
    this.usersService.getuserById(this.route.snapshot.params["id"]).then(
      (result:any) =>{
        console.log('test');
        console.log(result.etat);
        console.log('test');
        this.UserFormedit= new FormGroup({
          nomdutilisateur: new FormControl(result.nomdutilisateur,[
            Validators.required,
            Validators.pattern("^[a-zA-Z\\s]{3,35}$")
          ]),
          gid: new FormControl(result.gid,Validators.required),
          email: new FormControl(result.email,[Validators.required, Validators.email,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]),
          etat: new FormControl(result.etat,Validators.required),
          telephone: new FormControl(result.telephone,Validators.required),
        });
      }
    );
    

  }



  onUpdateUseredit(UserFormedit) {

      let userData:any = {};
      userData.nomdutilisateur = UserFormedit.value.nomdutilisateur;
      console.log(UserFormedit.value.gid);
      userData.gid = UserFormedit.value.gid; 
      userData.email = UserFormedit.value.email; 
      if(UserFormedit.value.etat == "true"){
        userData.etat = true; 
      }else if(UserFormedit.value.etat == "false"){
        userData.etat = false; 
      }
      userData.telephone = UserFormedit.value.telephone; 

      userData.datecreation = Date.now();
      userData.datemodification = Date.now();

      let id = this.route.snapshot.params["id"];
      console.log('upadte edit');
      console.log('id  : '+id);
      console.log(userData);
    this.usersService.updateUserData(id,userData);
    this.router.navigate(['/users']);
  }


  

  onBack() {
    this.router.navigate(['/users']);
  }
  
}