import { Component,  OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { Client } from '../models/Client.model';
import { ClientsService } from '../services/clients.service';
import * as XLSX from 'xlsx';
import { StringFormat } from '@angular/fire/compat/storage/interfaces';
import { CategoriesService } from '../services/categories.service';
import { Prespective } from '../models/Prespective.model';
import { PrespectivesService } from '../services/prespectives.service';
import { Prestation } from '../models/Prestation.model';
import { PrestationService } from '../services/prestation.service';

@Component({
  selector: 'app-prestation-list',
  templateUrl: './prestation-list.component.html',
  styleUrls: ['./prestation-list.component.css']
})
export class PrestationListComponent implements OnInit , OnDestroy {

  prestation: Prestation[] = [];
  filteredPrestations: Prestation[] = [];

  prestationSubscription: Subscription = new Subscription;
  searchPrestations: Prestation[] = [];

  fileName= 'ExcelSheet.xlsx';

  currentIndex = -1;
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3,6,9];
  searchtext!: string;
  dialogservice: any;
  categoriedata: any;
  idcategorie!:string;


  constructor(private prestationService: PrestationService, private router: Router,private route: ActivatedRoute){ }

  
  ngOnInit(): void {
   
  
    this.prestationSubscription = this.prestationService.prestationSubject.subscribe(
      (prestations: Prestation[]) => {
        this.searchPrestations = prestations;
        this.prestation = prestations;
        this.filteredPrestations = prestations;
        this.updatePagination();
        
      }
    );
    this.prestationService.getAllprestation();
    this.prestationService.emitPrestation();
  }

  ngOnDestroy() {
    this.prestationSubscription.unsubscribe();
  }

  searchByLabel(): void {
    if (this.searchtext.trim() === '') {
      this.filteredPrestations = this.prestation;
    } else {
      this.filteredPrestations = this.prestation.filter(prestation =>
        prestation.label?.toLowerCase().includes(this.searchtext.toLowerCase())
      );
    }
    this.updatePagination();
  }

  updatePagination(): void {
    this.count = this.filteredPrestations.length;
    this.filteredPrestations = this.filteredPrestations.slice(
      (this.page - 1) * this.pageSize,
      this.page * this.pageSize
    );
  }
  

  onNewPrestation() {
    this.router.navigate(['/prestations', 'new']);
  }

  onDeletePrestation(id?:string){
    this.prestationService.removePrestation(id);
    this.prestationService.getAllprestation();
  }

  onViewPrestation(id?: string) {
    this.router.navigate([ '/single-prestation', id]);
  }

  oneditPrestation(id?: string) {

    this.router.navigate([ '/prestations-edit', id]);
  }

  




  handlePageChange(event: number): void {
    this.page = event;
    this.updatePagination();
  }
  
  handlePageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.page = 1;
    this.updatePagination();
  }
  



  onBack() {
    this.router.navigate(['/prestations']);
  }

}