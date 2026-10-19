import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-single-user',
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.css']
})
export class SingleUserComponent implements OnInit {

  

  user : any;
  id: any;
  form: any;
  alertService: any;
  fileName= 'ExcelSheet.xlsx';

  constructor(private route: ActivatedRoute,
              private usersService: UsersService,
              private router: Router) { }

  
  ngOnInit(): void {
      this.getUser(this.route.snapshot.params["id"]);
  }
  getUser(id?: string): void {
    console.log(id);
    this.usersService.getdetailuserById(id).then(
      (data) => {
        console.log(data);

      this.user = data;
   
      }
     );
      
  }

  

  onBack() {
    this.router.navigate(['/users']);
  }

}
