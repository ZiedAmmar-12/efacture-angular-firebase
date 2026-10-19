import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoriesService } from 'src/app/services/categories.service';
@Component({
  selector: 'app-single-categorie',
  templateUrl: './single-categorie.component.html',
  styleUrls: ['./single-categorie.component.css']
})
export class SingleCategorieComponent implements OnInit {

  categorie : any;
  id: any;
  form: any;
  alertService: any;

  constructor(private route: ActivatedRoute,
              private categoriesService: CategoriesService,
              private router: Router) { }

  
  ngOnInit(): void {
      this.getCategorie(this.route.snapshot.params["id"]);
  }
  getCategorie(id?: string): void {
    console.log(id);
    this.categoriesService.getdetailcategorieById(id).then(
      (data) => {
        console.log(data);

      this.categorie = data;
   
      }
     );
      
  }
  

  onBack() {
    this.router.navigate(['/categories']);
  }

}{

}
