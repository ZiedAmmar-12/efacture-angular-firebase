import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PrespectivesService } from 'src/app/services/prespectives.service';

@Component({
  selector: 'app-single-prespective',
  templateUrl: './single-prespective.component.html',
  styleUrls: ['./single-prespective.component.css']
})
export class SinglePrespectiveComponent implements OnInit {

  prespective : any;
  id: any;
  form: any;
  alertService: any;
  categoriedata: any;
  nomcategoriedata:any;
  imageUrl:any;
  constructor(private route: ActivatedRoute,
              private prespectiveService: PrespectivesService,
              private router: Router) { }

  
  ngOnInit(): void {
      this.getPrespective(this.route.snapshot.params["id"]);
    //  const imagePath =  "images/1713299999249_Screenshot 2024-02-28 at 13.11.21.png/Screenshot 2024-02-28 at 13.11.21.png"
    
      // Obtenir l'URL de téléchargement de l'image
      //this.imageUrl = this.societesService.getImageUrl(imagePath);
  }
/*
  getSociete(id?: string): void {
    console.log(id);
    this.societesService.getdetailsocieteById(id).then(
      (data) => {
        console.log(data);

      this.societe = data;
      
      }
     );
      
  }*/
  getPrespective(id?: string): void {
    this.prespectiveService.getdetailprespectivesById(id).then((data1) => {
      this.prespective = data1;
      console.log('my ',this.prespective);

      const idcategorie = this.prespective.idcategorie;
      console.log('my data ',data1);
      this.prespectiveService.getnomcategorie(this.prespective.idcategorie).then((data3) => {
        this.nomcategoriedata = data3;
        console.log('my data 3 ',data3);
  
      });
     
      
    
    
    });

   
    
    

  }


  onBack() {
    this.router.navigate(['/prespectives']);
  }
}
