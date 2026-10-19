import { Component,  OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Facture } from '../models/Facture.model';
import { FacturesService } from '../services/factures.service';
import * as XLSX from 'xlsx';
import { StringFormat } from '@angular/fire/compat/storage/interfaces';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';




@Component({
  selector: 'app-facture-list',
  templateUrl: './facture-list.component.html',
  styleUrls: ['./facture-list.component.css']
})
export class FactureListComponent implements OnInit , OnDestroy {
  myComponent: any;

  constructor(private facturesService: FacturesService, private router: Router, private route: ActivatedRoute){ }

  factures: Facture[] = [];
  facturesSubscription: Subscription = new Subscription;
  searchFactures: Facture[] = [];

  fileName= 'ExcelSheet.xlsx';
  

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3,6,9];
  searchtext!: string;
  dialogservice: any;
  idsociete!:string;
  datasociete:any;
  
  

  ngOnInit(): void {
    
    this.facturesSubscription = this.facturesService.facturesSubject.subscribe(
      (factures: Facture[]) => {
       this.searchFactures = factures;
      }
    );
    this.idsociete = this.route.snapshot.params["idsociete"];
    if (this.idsociete) {
      
      localStorage.setItem('idsocietestorage', this.idsociete);
    }else{
      
      this.idsociete = localStorage.getItem("idsocietestorage") || '';
    }
    

    this.facturesService.getsocietebyid(this.idsociete).then(
      (data) => {
        this.datasociete = data;
        
      }
     );
     
    this.facturesService.getAllfacture(this.idsociete);
    this.facturesService.emitFactures();
  }

  ngOnDestroy() {
    this.facturesSubscription.unsubscribe();
  }

  onNewFacture() {
    this.router.navigate(['/factures', 'new']);
  }

  onDeleteFacture(id?:string){

    this.facturesService.removeFacture(id);
    this.facturesService.getAllfacture(this.idsociete);
  }

  onViewFacture(id?: string) {
    this.router.navigate([ '/single-facture', id]);
  }

  oneditFacture(id?: string) {

    this.router.navigate([ '/facture-edit', id]);
  }


search(query: string){

    this.searchFactures = (query) ? this.factures.filter(Facture => Facture.numfacture?.includes(query) 
                                                   || Facture.numfacture?.toUpperCase().includes(query.toUpperCase())) : this.factures;
    

  }

  handlePageChange(event:number){
    this.page = event;
    this.facturesService.getAllfacture(this.idsociete);
  }

  handlePageSizeChange(event:any){
    this.pageSize = event.target.value;
    this.page = 1;
    this.facturesService.getAllfacture(this.idsociete);
  }

  

  exportexcel(): void {

    var workbook = XLSX.utils.book_new();
    var tabelementfacturexls :  any[][] = [];
    var tabdatasheet=[["Num facture", "References", "Description", "Quantite", "Prix Unitaire HT","Montant HT", "Id", "Id Client",
                       "Id Societe", "Date validité facture", "Option TVA", "Timbre Fiscal", "Total HT", "Total TTC"]];
    
      this.searchFactures.forEach((value, index) => {
      
        tabelementfacturexls.push([value.numfacture, value.refid, value.references?.description, value.references?.quantite,
                                   value.references?.prix_unitaire_HT, value.references?.montant_HT, value.id, value.idclient,
                                   value.idsociete, value.date_valid_fact, value.optiontva, value.timbrefiscal, value.totalht,
                                   value.totalttc]);
      
      tabdatasheet.push(tabelementfacturexls[index]);
      
    }); 

   var worksheet = XLSX.utils.aoa_to_sheet(tabdatasheet);

   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
   XLSX.writeFile(workbook, this.fileName);
 
  }


  onBack() {
    this.router.navigate(['/societes']);
  }
  
}