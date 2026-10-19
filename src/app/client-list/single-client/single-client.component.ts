import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from 'src/app/services/clients.service';


@Component({
  selector: 'app-single-client',
  templateUrl: './single-client.component.html',
  styleUrls: ['./single-client.component.css']
})
export class SingleClientComponent implements OnInit {

  client : any;
  id: any;
  form: any;
  alertService: any;

  constructor(private route: ActivatedRoute,
              private clientsService: ClientsService,
              private router: Router) { }

  
  ngOnInit(): void {
      this.getClient(this.route.snapshot.params["id"]);
  }
  getClient(id?: string): void {
    console.log(id);
    this.clientsService.getdetailclientById(id).then(
      (data) => {
        console.log(data);

      this.client = data;
   
      }
     );
      
  }
  

  onBack() {
    this.router.navigate(['/clients']);
  }

}