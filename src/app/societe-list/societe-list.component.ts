import { Component,  OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Societe } from '../models/Societe.model';
import { SocietesService } from '../services/societes.service';
import * as XLSX from 'xlsx';
import { StringFormat } from '@angular/fire/compat/storage/interfaces';

@Component({
  selector: 'app-societe-list',
  templateUrl: './societe-list.component.html',
  styleUrls: ['./societe-list.component.css']
})
export class SocieteListComponent implements OnInit , OnDestroy  {

  constructor(private societesService: SocietesService, private router: Router){ }

  societes: Societe[] = [];
  societesSubscription: Subscription = new Subscription;
  searchSocietes: Societe[] = [];

  fileName= 'ExcelSheet.xlsx';

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3,6,9];
  searchtext!: string;
  dialogservice: any;
  

  ngOnInit(): void {
    
    this.societesSubscription = this.societesService.societesSubject.subscribe(
      (societes: Societe[]) => {
        this.searchSocietes = societes;
       
      }
    );
    this.societesService.getAllsociete();
    this.societesService.emitSocietes();
  }

  ngOnDestroy() {
    this.societesSubscription.unsubscribe();
  }

  onNewSociete() {
    this.router.navigate(['/societes', 'new']);
  }

  onDeleteSociete(id?:string){
    this.societesService.removeSociete(id);
    this.societesService.getAllsociete();
  }

  onViewSociete(id?: string) {
    this.router.navigate([ '/single-societe', id]);
  }

  oneditSociete(id?: string) {

    this.router.navigate([ '/societe-edit', id]);
  }

  onViewfacture(id?: string){
    this.router.navigate([ '/facture-list', id])
  }
  onViewdevis(id?: string){
    this.router.navigate([ '/devis-list', id])
  }

  search(query: string){

    this.searchSocietes = (query) ? this.societes.filter(Societe => Societe.nomsociete?.includes(query) ) : this.societes;
    

  }
  

  handlePageChange(event:number){
    this.page = event;
    this.societesService.getAllsociete();
  }

  handlePageSizeChange(event:any){
    this.pageSize = event.target.value;
    this.page = 1;
    this.societesService.getAllsociete();
  }

  exportexcel(): void
  {
 
    var workbook = XLSX.utils.book_new();
    var tabelementsocietexls :any[][] = [];
    var tabdatasheet=[ ["Nom societe", "Siret societe","Adresse societe", "Code postale", "Pays", "Directeur societe",
                        "N° telephone societe","Email societe", "Site web", "Type device facture","Etat societe", "Nom banque",
                        "Code banque", "Numéro compte", "swift" ]];
      
      this.searchSocietes.forEach((value, index) => {
      
      tabelementsocietexls.push([value.nomsociete, value.siret, value.adresse, value.codepostale, value.pays,value.directeur, 
                                 value.telephone, value.email, value.siteweb, value.type_dev_fac, value.etat, 
                                 value.nombanque, value.codebanque, value.numcompte, value.swift ]);

      tabdatasheet.push(tabelementsocietexls[index]);
        
    }); 

    
    
   var worksheet = XLSX.utils.aoa_to_sheet(tabdatasheet);

   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
   XLSX.writeFile(workbook, this.fileName);
 
  }
  



}


