import { Component,  OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { User } from '../models/User.model';
import { UsersService } from '../services/users.service';
import * as XLSX from 'xlsx';
import { StringFormat } from '@angular/fire/compat/storage/interfaces';
import { AuthService } from '../services/auth.service';
import { Auth } from '@angular/fire/auth';



@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit , OnDestroy {

  userGid!: number;
  
  

  constructor(private usersService: UsersService, private router: Router, private authService: AuthService, private auth: Auth){ }

  users: User[] = [];
  usersSubscription: Subscription = new Subscription;
  searchUsers: User[] = [];

  fileName= 'ExcelSheet.xlsx';

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3,6,9];
  searchtext!: string;
  dialogservice: any;
  

  ngOnInit(): void {
    
    this.usersSubscription = this.usersService.usersSubject.subscribe(
      (users: User[]) => {
        this.searchUsers = users;
        
      }
    );
    this.usersService.getAlluser();
    this.usersService.emitUsers();

    const user = this.auth.currentUser;
    if (user) {
      this.authService.getUserGid(user.uid).subscribe((gid) => {
        this.userGid = gid;
      });
    }
  }

  ngOnDestroy() {
    this.usersSubscription.unsubscribe();
  }

  canAddManager(): boolean {
    return this.userGid === 24; // Seulement l'admin peut ajouter un manager
  }

  canAddAgent(): boolean {
    return this.userGid === 24 || this.userGid === 23; // Admin ou manager peuvent ajouter un agent
  }

  onNewUser() {
    this.router.navigate(['/users', 'new']);
  }

  onDeleteUser(id?:string){
    this.usersService.removeUser(id);
    this.usersService.getAlluser();
  }

  onViewUser(id?: string) {
    this.router.navigate([ '/single-user', id]);
  }

  oneditUser(id?: string) {

    this.router.navigate([ '/user-edit', id]);
  }


  search(query: string){

    this.searchUsers = (query) ? this.users.filter(User => User.nomdutilisateur?.includes(query)) : this.users;
    

  }


  handlePageChange(event:number){
    this.page = event;
    this.usersService.getAlluser();
  }

  handlePageSizeChange(event:any){
    this.pageSize = event.target.value;
    this.page = 1;
    this.usersService.getAlluser();
  }

  

  exportexcel(): void
  {

    var workbook = XLSX.utils.book_new();
    var tabelementuserxls :any[][] = [];
    var tabdatasheet=[ ["Nom d'utilisateur", "Role d'utilisateur","Etat d'utilisateur", "Email d'utilisateur", "telephone "]];
      
      this.searchUsers.forEach((value, index) => {
      
      tabelementuserxls.push([value.nomdutilisateur, value.gid, value.etat, value.email, value.telephone]);
      
      tabdatasheet.push(tabelementuserxls[index]);
    }); 

   
    
   var worksheet = XLSX.utils.aoa_to_sheet(tabdatasheet);

   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
   XLSX.writeFile(workbook, this.fileName);
 
  }

  
}
