import { Component,  OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Client } from '../models/Client.model';
import { ClientsService } from '../services/clients.service';
import * as XLSX from 'xlsx';
import { StringFormat } from '@angular/fire/compat/storage/interfaces';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit , OnDestroy {


  constructor(private clientsService: ClientsService, private router: Router){ }

  clients: Client[] = [];
  clientsSubscription: Subscription = new Subscription;
  searchClients: Client[] = [];

  fileName= 'ExcelSheet.xlsx';

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3,6,9];
  searchtext!: string;
  dialogservice: any;
  

  ngOnInit(): void {
    
    this.clientsSubscription = this.clientsService.clientsSubject.subscribe(
      (clients: Client[]) => {
        this.searchClients = clients;
        
      }
    );
    this.clientsService.getAllclient();
    this.clientsService.emitClients();
  }

  ngOnDestroy() {
    this.clientsSubscription.unsubscribe();
  }

  onNewClient() {
    this.router.navigate(['/clients', 'new']);
  }

  onDeleteClient(id?:string){
    this.clientsService.removeClient(id);
    this.clientsService.getAllclient();
  }

  onViewClient(id?: string) {
    this.router.navigate([ '/single-client', id]);
  }

  oneditClient(id?: string) {

    this.router.navigate([ '/client-edit', id]);
  }

  

  search(query: string){

    this.searchClients = (query) ? this.clients.filter(Client => Client.nomclient?.includes(query) ) : this.clients;
    

  }


  handlePageChange(event:number){
    this.page = event;
    this.clientsService.getAllclient();
  }

  handlePageSizeChange(event:any){
    this.pageSize = event.target.value;
    this.page = 1;
    this.clientsService.getAllclient();
  }

  exportexcel(): void
  {
 
    var workbook = XLSX.utils.book_new();
    var tabelementclientxls :any[][] = [];
    var tabdatasheet=[ ["Nom et prénom client", "N° telephone client","Email client", "Siren client", "Nom gérant", "Adresse client"]];
      
      this.searchClients.forEach((value, index) => {
      
      tabelementclientxls.push([value.nomclient,value.telephone,value.email,value.siren,value.nomgerant,value.adresse]);
     
      tabdatasheet.push(tabelementclientxls[index]);
      
    }); 

    
  
   var worksheet = XLSX.utils.aoa_to_sheet(tabdatasheet);

   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
   XLSX.writeFile(workbook, this.fileName);

  }
  



}
