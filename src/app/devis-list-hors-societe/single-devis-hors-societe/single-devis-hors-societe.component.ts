import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Devis } from 'src/app/models/Devis.model';
import { DevisService } from 'src/app/services/devis.service';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-single-devis-hors-societe',
  templateUrl: './single-devis-hors-societe.component.html',
  styleUrls: ['./single-devis-hors-societe.component.css']
})
export class SingleDevisHorsSocieteComponent implements OnInit {
  devis: any;
  id: any;
  form: any;
  alertService: any;
 
  searchDevis: Devis[] = [];
  nomsocietedata: any;
  nomclientdata: any;

  constructor(
    private route: ActivatedRoute,
    private devisService: DevisService,
    private router: Router
  ) {}

 

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3,6,9];
  searchtext!: string;
  dialogservice: any;
  ngOnInit(): void {
    this.getDevis(this.route.snapshot.params['id']);
    
    
  }

  getDevis(id?: string): void {
    this.devisService.getdetaildevisById(id).then((data1) => {
      this.devis = data1;
      const idsociete = this.devis.idsociete;
      const idclient = this.devis.idclient;

      this.devisService.getnomsociete(idsociete).then((data2) => {
        this.nomsocietedata = data2;
      });
      this.devisService.getnomclient(idclient).then((data3) => {
        this.nomclientdata = data3;
      });
    });
  }
 
/*
  exportAsPDF() {
    const element = document.getElementById('element-to-export');
    html2pdf().from(element).save();
  }
  
  transformToExcel() {
    const element = document.getElementById('element-to-export');
    const wb = XLSX.utils.table_to_book(element);
    XLSX.writeFile(wb, 'exported-file.xlsx');
  }
*/
  @ViewChild('content', { static: false }) el!: ElementRef;

  makePdf(){
    const pdf = new jsPDF('p', 'mm', 'a4');

    const element = this.el.nativeElement as HTMLElement;

    // Use html2canvas to capture the HTML content as an image
    html2canvas(element,{ 
      width: 2480,
     
    }).then(canvas => {
      // Convert the canvas to a data URL
      //const imgData = canvas.toDataURL('image/png');
      const contentDataURL = canvas.toDataURL('image/jpeg', 1.0)

      // Add the captured image to the PDF
      //pdf.addImage(imgData, 'PNG', 1, 0,0,0); // Use the dimensions of the PDF
      pdf.addImage(contentDataURL, 'PNG', 0, 0, 0, 0);  
     
      // Save the PDF
      pdf.save('devis.pdf');
    });
  }
 
  print() {
    window.print();
  }



  /**Default name for excel file when download**/
fileName = "ExcelSheet.xlsx";
exporttoexcel() {
/**passing table id**/
let data = document.getElementById("table-data");
const ws: XLSX. WorkSheet = XLSX.utils.table_to_sheet(data)
/**Generate workbook and add the worksheet**/
const wb: XLSX.WorkBook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
/*save to file */
XLSX.writeFile(wb,this.fileName)
}
  onBack() {
    this.router.navigate(['/devis']);
  }
  
  exportexcel(): void {
    let data = document.getElementById("table-data");
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
  // Your HTML data (replace this with your actual data)
  

  transformHTMLToExcel() {
    const workbook = XLSX.utils.book_new();
    const sheet = XLSX.utils.table_to_sheet(document.getElementById('your-table-id'));
    XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

    // Save the workbook as an Excel file
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const excelBlob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(excelBlob, 'Devis.xlsx');
  }


}
