import { Component, ElementRef, OnInit, ViewChild , HostListener} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Devis } from 'src/app/models/Devis.model';
import { DevisService } from 'src/app/services/devis.service';
import  jspdf, { jsPDF } from 'jspdf';

import { Subscription } from 'rxjs';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import autoTable, { Row, UserOptions } from 'jspdf-autotable';
//import * as html2pdf from 'html2pdf.js';
interface jsPDFWithPlugin extends jspdf{
  autotable: (options: UserOptions) =>jspdf;
  }
@Component({
  selector: 'app-single-devis',
  templateUrl: './single-devis.component.html',
  styleUrls: ['./single-devis.component.css'],
})
export class SingleDevisComponent implements OnInit {

  devis: any;
  id: any;
  form: any;
  alertService: any;
 
  searchDevis: Devis[] = [];
  nomsocietedata: any;
  nomclientdata: any;
  imageUrl:any;
  base64Img:any;
 
  constructor(
    private route: ActivatedRoute,
    private devisService: DevisService,
    private router: Router
  ) {}

  lastY: any;

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
      console.log('my devis ',this.devis);

      this.devisService.getnomsociete(idsociete).then((data2) => {
        this.nomsocietedata = data2;
        console.log('my soc ',this.nomsocietedata);
        if(this.nomsocietedata && this.nomsocietedata.imageUrl){
          this.devisService.getImageUrl(this.nomsocietedata.imageUrl).then((url) => {
            this.imageUrl = url;
            this.toDataUrl(this.imageUrl,function(data){
              console.log('base64Img',data)
            });
            console.log('my img',this.imageUrl);
          })
        }
      });
     
     
      this.devisService.getnomclient(idclient).then((data3) => {
        this.nomclientdata = data3;
        console.log('my nomclientdata ',this.nomclientdata);

          
      });
    });
  }
  /*toDataURL(url: string, callback: (base64Img: string) => void) {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      const reader = new FileReader();
      reader.onloadend = function() {
        callback(reader.result as string);
      };
      reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
    console.log(this.base64Img)
  }
*/
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
*//*
downloadPDF(){
  const doc = new jspdf("p","px","a4") as jsPDFWithPlugin ;
  doc.addImage(this.imageUrl, 'JPEG', 10, 10, 50, 50);
  autoTable(doc,{
    body:[
      [
      {
        content:'Devis N°:' +this.devis?.numDevis,
        styles:{
          halign:"left",
          
         textColor: [0, 205, 255] // RGB values for blue marine
           

        }
      },
      {
        content:this.devis?.image,
        styles:{
          halign:"right",
          
        }
      },
    ],
  ],
  theme:'plain',
  styles:{
    
  }
  });
  autoTable(doc, {
    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 0) {
       this.toDataUrl(this.imageUrl,function(data){
          console.log('base64Img',data)
         const base64Img = data;
        });
        doc.addImage('base64Img', 'JPEG', data.cell.x + 2, data.cell.y + 2, 10, 10)
      }
    },
  })
  autoTable(doc,{
    body:[
      [
      {
        content:this.nomsocietedata.nomsociete + ' ' +'S.A.R.L'
        +'\n' +this.nomsocietedata?.adresse
        +'\n' +this.nomsocietedata?.codepostale
        +'\n' +this.nomsocietedata?.telephone,
        
        styles:{
          
          

        }
      },
      
    ],
  ],
  theme:'plain',
  styles:{
    halign:"left",
  }
  });
  
 
    autoTable(doc,{
    body:[
      [
      {
        content:'Date du devis: ' + this.formatDate(new Date(Number(this.devis.datecreation)))
        +'\n' + 'Référence du devis:'+this.devis?.numDevis 
        +'\n' + 'Nom Client:'+this.nomclientdata.nomclient  
        +'\n' + 'E-mail Client:'+this.nomclientdata.email 
        +'\n' + 'Contact Client:'+this.nomclientdata.telephone  ,
        
        styles:{
          
          

        }
        
      },
      
      {
        content:'Destinataire'
        +'\n'+this.nomclientdata.nomclient
        +'\n'+this.nomclientdata.adresse ,
        styles:{
          halign:"right",
          valign:"top"
          
        }
      },
      
    ],
  ],
  theme:'plain',
  styles:{
    halign:"left",
  }
  });
  autoTable(doc,{
    body:[
      [
      {
        content:'Information additionnelles ' 
        +'\n' + 'Service après-vente '  ,
        
        styles:{
          
          

        }
        
      },
    
      
    ],
  ],
  theme:'plain',
  styles:{
    halign:"left",
  }
  });
  

  const bodyData = this.devis.devisItems[0].references.map(item => [item.refid, item.description, item.quantite, item.totalht
    ,item.optiontva + '%', item.montant_HT + item.type_dev_fac]);
  autoTable(doc, {
    head: [['Réf', 'Description', 'Quantité', 'Prix unitaire HT', 'TVA', 'Montant HT']],
    body: bodyData,
    theme: 'striped',
    headStyles: { fillColor: [0, 205, 255] }
  });

  autoTable(doc, {
    body: [
      [{ content: `Total HT: ${this.devis.totalAmount}${this.devis.type_dev_fac}\nTVA: ${this.devis.tva}\nTimbre fiscal: ${this.devis.timbrefiscal}\nTotal TTC: ${this.devis.totalAmount + this.devis.tva}${this.devis.type_dev_fac}`, styles: { halign: 'right' } }],
    ],
    theme: 'plain',
    styles: { halign: "left" }
  });

  autoTable(doc, {
    body: [
      [
        { content: `Directeur: ${this.nomsocietedata.directeur}\nAdresse: ${this.nomsocietedata.adresse}\nCode Postale: ${this.nomsocietedata.codepostale}\nSiret: ${this.nomsocietedata.siret}`, styles: {} },
        { content: `Société: ${this.nomsocietedata.nomsociete} S.A.R.L\nTéléphone: ${this.nomsocietedata.telephone}\nEmail: ${this.nomsocietedata.email}\nSite Web: ${this.nomsocietedata.siteweb}`, styles: {} },
        { content: `Code Banque: ${this.nomsocietedata.codebanque}\nBanque: ${this.nomsocietedata.banque}\nCompte: ${this.nomsocietedata.numcompte}\nSwift: ${this.nomsocietedata.swift}`, styles: {} },
      ],
    ],
    theme: 'plain',
    styles: {
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    headStyles: {
      fillColor: [0, 71, 139]
    },
    bodyStyles: {
      fillColor: [0, 29, 88]
    },
    startY: 550,
    margin: { top: 20, bottom: 20, left: 20, right: 20 },
  });

  doc.save("devis.pdf");
}
*/
downloadPDF = () => {
  const doc = new jsPDF("p", "px", "a4");
  // Ajouter une image en haut à gauche
  doc.addImage(this.base64Img, 'PNG', 110, 10, 150, 150);
 // doc.addImage(this.imageUrl, 'JPEG', 10, 10, 150, 150);

  // Tableau principal avec les informations de base du devis
  autoTable(doc, {
    body: [
      [
        {
          content: 'Devis N°: ' + this.devis?.numDevis,
          styles: {
            halign: "left",
            textColor: [0, 205, 255] // Couleur bleu marine
          }
        },
        {
          content: this.devis?.image,
          styles: {
            halign: "right",
          }
        },
      ],
    ],
    theme: 'plain',
  });

  // Ajouter les informations de la société
  autoTable(doc, {
    body: [
      [
        {
          content: this.nomsocietedata.nomsociete + ' S.A.R.L'
            + '\n' + this.nomsocietedata?.adresse
            + '\n' + this.nomsocietedata?.codepostale
            + '\n' + this.nomsocietedata?.telephone,
          styles: {
            halign: "left",
          }
        },
      ],
    ],
    theme: 'plain',
  });

  // Ajouter les informations du devis et du client
  autoTable(doc, {
    body: [
      [
        {
          content: 'Date du devis: ' + this.formatDate(new Date(Number(this.devis.datecreation)))
            + '\nRéférence du devis: ' + this.devis?.numDevis
            + '\nNom Client: ' + this.nomclientdata.nomclient
            + '\nE-mail Client: ' + this.nomclientdata.email
            + '\nContact Client: ' + this.nomclientdata.telephone
            + '\nDate Création: ' + this.formatDate(new Date(Number(this.devis.datecreation)))
            + '\nDate Modification: ' + this.formatDate(new Date(Number(this.devis.datemodification))),
          styles: {
            halign: "left",
          }
        },
        {
          content: 'Destinataire'
            + '\n' + this.nomclientdata.nomclient
            + '\n' + this.nomclientdata.adresse,
          styles: {
            halign: "center",
            valign: "top"
          }
        },
      ],
    ],
    theme: 'plain',
    didDrawPage: (data) => { this.lastY = data.cursor?.y; 
     
    },
  });

  // Variable pour suivre la position Y de la dernière table ajoutée
  

  // Iterate over each devisItem and create a table for each
  this.devis.devisItems.forEach((item, index) => {
    // Ajouter un label avant chaque tableau de référence
    doc.text(`Label ${index + 1}: ${item.label}`, 30, this.lastY + 40);

    // Préparer les données du tableau des références
    const bodyData = item.references.map(ref => [
      ref.refid,
      ref.description,
      ref.quantite,
      ref.prix_unitaire_HT + ' ' + this.devis.type_dev_fac,
      item.optiontva + '%',
      ref.montant_HT + ' ' + this.devis.type_dev_fac,
    ]);

    // Ajouter le tableau des références
     autoTable(doc, {
      head: [['Réf', 'Description', 'Quantité', 'Prix unitaire HT', 'TVA', 'Montant HT']],
      body: bodyData,
      startY: this.lastY + 50,
      theme: 'striped',
      headStyles: { fillColor: [128, 128, 128] },
      didDrawPage:(data)=>{
       this.lastY = data.cursor?.y;
      }
    });

    
    // Ajouter un tableau supplémentaire pour les totaux de l'item
    autoTable(doc, {
      body: [
        [
          {
            content: `Total HT: ${item.totalht} ${this.devis.type_dev_fac}\nTVA: ${item.tva}\nTotal TTC: ${item.totalttc}`,
            styles: { halign: 'right' }
          }
        ],
      ],
      theme: 'plain',
      styles: { halign: "left" },
      startY: this.lastY + 5,
    });

    
  });

  // Ajouter le tableau récapitulatif avec les totaux du devis
  autoTable(doc, {
    body: [
      [{
        content: `Total : ${this.devis.totalAmount}${this.devis.type_dev_fac}\n`,
        styles: { halign: 'right' }
      }],
    ],
    theme: 'plain',
    styles: { halign: "left" },
    startY: this.lastY + 35
  });


  
  
  /*autoTable(doc, {
    body: [
      [
        { content: `Directeur: ${this.nomsocietedata.directeur}\nAdresse: ${this.nomsocietedata.adresse}\nCode Postale: ${this.nomsocietedata.codepostale}\nSiret: ${this.nomsocietedata.siret}`, styles: {} },
        { content: `Société: ${this.nomsocietedata.nomsociete} S.A.R.L\nTéléphone: ${this.nomsocietedata.telephone}\nEmail: ${this.nomsocietedata.email}\nSite Web: ${this.nomsocietedata.siteweb}`, styles: {} },
        { content: `Code Banque: ${this.nomsocietedata.codebanque}\nBanque: ${this.nomsocietedata.banque}\nCompte: ${this.nomsocietedata.numcompte}\nSwift: ${this.nomsocietedata.swift}`, styles: {} },
      ],
    ],
    theme: 'plain',
    styles: {
      textColor: [255, 255, 255],
      fontSize: 10,
    },
    headStyles: {
      fillColor: [0, 71, 139]
    },
    bodyStyles: {
      fillColor: [0, 29, 88]
    },
    startY: 550,
    margin: { top: 20, bottom: 20, left: 20, right: 20 },
  });*/
  // Enregistrer le PDF

  
  doc.save('devis.pdf');
};


  @ViewChild('content', { static: false }) el!: ElementRef;

  makePdf() {
    const pdf = new jspdf('p', 'mm', 'a4');

    const element = this.el.nativeElement as HTMLElement;
    const a4WidthInPixels = 210 * 96 / 25.4; // 25.4mm = 1 inch
    // Use html2canvas to capture the HTML content as an image
    html2canvas(element,{ 
       width: a4WidthInPixels 
     
    }).then(canvas => {
      // Convert the canvas to a data URL
      //const imgData = canvas.toDataURL('image/png');
      
      const contentDataURL = canvas.toDataURL('image/jpeg', 1.0)

      // Add the captured image to the PDF
      //pdf.addImage(imgData, 'PNG', 1, 0,0,0); // Use the dimensions of the PDF
      
     // pdf.addImage(contentDataURL, 'PNG', 0, 0, 0, 0);  
     pdf.addImage(contentDataURL, 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
    
      
        
      // Save the PDF
      pdf.save('devis.pdf');
    });
  }/*
  @ViewChild('content', { static: false }) content!: ElementRef;

  makPdf() {
    const pdf = new jsPDF('p', 'mm', 'a4');

    const contentElement = this.content.nativeElement as HTMLElement;
    const a4WidthInPixels = 210 * 96 / 25.4; // 25.4mm = 1 inch

    // Use html2canvas to capture the HTML content as an image
    html2canvas(contentElement, { width: a4WidthInPixels }).then(canvas => {
      const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Calculate the number of pages needed
      const totalHeight = canvas.height;
      const numPages = Math.ceil(totalHeight / pageHeight);

      let yPos = 0;
      let remainingHeight = totalHeight;

      // Iterate through the pages and add content
      for (let i = 0; i < numPages; i++) {
        // Create a new page if not the first page
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate the height of the current page
        const pageContentHeight = Math.min(pageHeight, remainingHeight);

        // Add the content to the PDF
        pdf.addImage(contentDataURL, 'JPEG', 0, -yPos, a4WidthInPixels, pageContentHeight);

        // Update the position for the next page
        yPos += pageContentHeight;
        remainingHeight -= pageContentHeight;
      }

      // Save the PDF
      pdf.save('example.pdf');
    });
  }
*/
 
  print() {
    window.print();
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
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

 
   toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET');
    xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
    xhr.responseType = 'blob';

    xhr.open('GET', url);
   
    xhr.send();
}

}
