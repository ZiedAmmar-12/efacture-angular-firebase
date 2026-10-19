
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
@Component({
  selector: 'app-prespective-list',
  templateUrl: './prespective-list.component.html',
  styleUrls: ['./prespective-list.component.css']
})
export class PrespectiveListComponent implements OnInit , OnDestroy {


  constructor(private prespectivesService: PrespectivesService, private router: Router,private route: ActivatedRoute){ }

  prespectives: Prespective[] = [];
  prespectivesSubscription: Subscription = new Subscription;
  searchPrespectives: Prespective[] = [];

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
  ngOnInit(): void {
    this.prespectivesService.getAllcategorie().then(
      (data) => {
        this.categoriedata = data;
        console.log(this.categoriedata)
      }
    );
    this.idcategorie = this.route.snapshot.params["idcategorie"];
    if (this.idcategorie) {
      
      localStorage.setItem('idcategoriestorage', this.idcategorie);
    }else{
      
      this.idcategorie = localStorage.getItem("idcategorietorage") || '';
    }
    this.prespectivesService.getcategoriebyid(this.idcategorie).then(
      (data) => {
        this.categoriedata = data;
      
      }
     );
    this.prespectivesSubscription = this.prespectivesService.prespectivesSubject.subscribe(
      (prespectives: Prespective[]) => {
        this.searchPrespectives = prespectives;
        
      }
    );
    this.prespectivesService.getAllprespectives();
    this.prespectivesService.emitPrestations();
  }

  ngOnDestroy() {
    this.prespectivesSubscription.unsubscribe();
  }

  onNewPrestation() {
    this.router.navigate(['/prespectives', 'new']);
  }

  onDeletePrestation(id?:string){
    this.prespectivesService.removePrespectiveDatas(id);
    this.prespectivesService.getAllprespectives();
  }

  onViewPrestation(id?: string) {
    this.router.navigate([ '/single-prespective', id]);
  }

  oneditPrestation(id?: string) {

    this.router.navigate([ '/prespectives-edit', id]);
  }

  




  handlePageChange(event:number){
    this.page = event;
    this.prespectivesService.getAllprespectives();
  }

  handlePageSizeChange(event:any){
    this.pageSize = event.target.value;
    this.page = 1;
    this.prespectivesService.getAllprespectives();
  }





}