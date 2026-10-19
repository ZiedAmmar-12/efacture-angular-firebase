import { Component,  OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Client } from '../models/Client.model';
import { ClientsService } from '../services/clients.service';
import * as XLSX from 'xlsx';
import { StringFormat } from '@angular/fire/compat/storage/interfaces';
import { CategoriesService } from '../services/categories.service';
import { Categorie } from '../models/Categorie.model';

@Component({
  selector: 'app-categorie-list',
  templateUrl: './categorie-list.component.html',
  styleUrls: ['./categorie-list.component.css']
})
export class CategorieListComponent  implements OnInit , OnDestroy {


  constructor(private categoriesService: CategoriesService, private router: Router){ }

  categories: Categorie[] = [];
  categoriesSubscription: Subscription = new Subscription;
  searchCategories: Categorie[] = [];

  fileName= 'ExcelSheet.xlsx';

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3,6,9];
  searchtext!: string;
  dialogservice: any;
  

  ngOnInit(): void {
    
    this.categoriesSubscription = this.categoriesService.categoriesSubject.subscribe(
      (categories: Categorie[]) => {
        this.searchCategories = categories;
        
      }
    );
    this.categoriesService.getAllcategorie();
    this.categoriesService.emitCategories();
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

  onNewCategorie() {
    this.router.navigate(['/categories', 'new']);
  }

  onDeleteCategorie(id?:string){
    this.categoriesService.removeCategorie(id);
    this.categoriesService.getAllcategorie();
  }

  onViewCategorie(id?: string) {
    this.router.navigate([ '/single-categorie', id]);
  }

  oneditCategorie(id?: string) {

    this.router.navigate([ '/categorie-edit', id]);
  }

  

  search(query: string){

    this.searchCategories = (query) ? this.categories.filter(Categorie => Categorie.nomcategorie?.includes(query) ) : this.categories;
    

  }


  handlePageChange(event:number){
    this.page = event;
    this.categoriesService.getAllcategorie();
  }

  handlePageSizeChange(event:any){
    this.pageSize = event.target.value;
    this.page = 1;
    this.categoriesService.getAllcategorie();
  }

  exportexcel(): void
  {
 
    var workbook = XLSX.utils.book_new();
    var tabelementcategoriexls :any[][] = [];
    var tabdatasheet=[ ["Nom Categorie"]];
      
      this.searchCategories.forEach((value, index) => {
      
        tabelementcategoriexls.push([value.nomcategorie]);
     
      tabdatasheet.push(tabelementcategoriexls[index]);
      
    }); 

    
  
   var worksheet = XLSX.utils.aoa_to_sheet(tabdatasheet);

   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
   XLSX.writeFile(workbook, this.fileName);

  }
  



}