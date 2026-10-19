import { Component,  OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Devis } from '../models/Devis.model';
import { DevisService } from '../services/devis.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-devis-list-hors-societe',
  templateUrl: './devis-list-hors-societe.component.html',
  styleUrls: ['./devis-list-hors-societe.component.css']
})
export class DevisListHorsSocieteComponent implements OnInit , OnDestroy {

  myComponent: any;

  constructor(private devisService: DevisService, private router: Router, private route: ActivatedRoute){ }

  devis: Devis[] = [];
  devisSubscription: Subscription = new Subscription;
  searchDevis: Devis[] = [];

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
    
    this.devisSubscription = this.devisService.devisSubject.subscribe(
      (factures: Devis[]) => {
       this.searchDevis = factures;
      }
    );
    this.idsociete = this.route.snapshot.params["idsociete"];
    if (this.idsociete) {
      
      localStorage.setItem('idsocietestorage', this.idsociete);
    }else{
      
      this.idsociete = localStorage.getItem("idsocietestorage") || '';
    }
    

    this.devisService.getsocietebyid(this.idsociete).then(
      (data) => {
        this.datasociete = data;
        
      }
     );
     
    this.devisService.getAlldevis(this.idsociete);
    this.devisService.emitDevis();
  }

  ngOnDestroy() {
    this.devisSubscription.unsubscribe();
  }

  onNewDevis() {
    this.router.navigate(['/devish', 'new']);
  }

  onDeleteDevis(id?:string){

    this.devisService.removeDevis(id);
    this.devisService.getAlldevis(this.idsociete);
  }

  onViewDevis(id?: string) {
    this.router.navigate([ '/single-devish', id]);
  }

  onEditDevis(id?: string) {

    this.router.navigate([ '/devish-edit', id]);
  }


search(query: string){

    this.searchDevis = (query) ? this.devis.filter(Devis => Devis.numdevis?.includes(query) 
                                                   || Devis.numdevis?.toUpperCase().includes(query.toUpperCase())) : this.devis;
    

  }

  handlePageChange(event:number){
    this.page = event;
    this.devisService.getAlldevis(this.idsociete);
  }

  handlePageSizeChange(event:any){
    this.pageSize = event.target.value;
    this.page = 1;
    this.devisService.getAlldevis(this.idsociete);
  }

  

  exportexcel(): void {

    var workbook = XLSX.utils.book_new();
    var tabelementdevisxls :  any[][] = [];
    var tabdatasheet=[["Num Devis", "References", "Description", "Quantite", "Prix Unitaire HT","Montant HT", "Id", "Id Client",
                       "Id Societe", "Date validité facture", "Option TVA", "Timbre Fiscal", "Total HT", "Total TTC"]];
    
      this.searchDevis.forEach((value, index) => {
      
        tabelementdevisxls.push([value.numdevis, value.refid, value.references?.description, value.references?.quantite,
                                   value.references?.prix_unitaire_HT, value.references?.montant_HT, value.id, value.idclient,
                                   value.idsociete, value.date_valid_fact, value.optiontva, value.timbrefiscal, value.totalht,
                                   value.totalttc]);
      
      tabdatasheet.push(tabelementdevisxls[index]);
      
    }); 

   var worksheet = XLSX.utils.aoa_to_sheet(tabdatasheet);

   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
   XLSX.writeFile(workbook, this.fileName);
 
  }


  onBack() {
    this.router.navigate(['/societes']);
  }
  
}
