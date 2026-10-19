import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturesService } from 'src/app/services/factures.service';
import { FormArray } from '@angular/forms';

import * as jsPDF from 'jspdf';

import { Facture } from 'src/app/models/Facture.model';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-single-facture',
  templateUrl: './single-facture.component.html',
  styleUrls: ['./single-facture.component.css']
})
export class SingleFactureComponent implements OnInit {

  facture : any;
  id: any;
  form: any;
  alertService: any;
  title = 'htmltopdf';
  searchFactures: Facture[] = [];
  nomsocietedata: any;
  nomclientdata: any;
  
 

  constructor(private route: ActivatedRoute,
              private facturesService: FacturesService,
              private router: Router) { }

  
  ngOnInit(): void {

      this.getFacture(this.route.snapshot.params["id"]);

  }



  

  getFacture(id?: string): void {
    
    this.facturesService.getdetailfactureById(id).then(
      (data1) => {
          this.facture = data1; 
          const idsociete = this.facture.idsociete;
          const idclient = this.facture.idclient;
          
          this.facturesService.getnomsociete(idsociete).then(
            (data2) => {
              this.nomsocietedata = data2;
            }
          );
          this.facturesService.getnomclient(idclient).then(
            (data3) => {
              this.nomclientdata = data3;
            }
          );
      }
     );
      
  }


  @ViewChild('pdfTable')
  pdfTable!: ElementRef;
  
  /*public downloadAsPDF() {
    const doc = new jsPDF();
   
    const pdfTable = this.pdfTable.nativeElement;
   
    var html = htmlToPdfmake(pdfTable.innerHTML);
     
    const documentDefinition = { content: html };
    pdfMake.createPdf(documentDefinition).open(); 
     
  }*/

  print() {
    window.print();
  }

  
  

  onBack() {
    this.router.navigate(['/factures']);
  }

}