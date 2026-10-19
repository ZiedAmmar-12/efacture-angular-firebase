import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocietesService } from '../../services/societes.service';

@Component({
  selector: 'app-single-societe',
  templateUrl: './single-societe.component.html',
  styleUrls: ['./single-societe.component.css']
})
export class SingleSocieteComponent implements OnInit {

  societe : any;
  id: any;
  form: any;
  alertService: any;
  categoriedata: any;
  nomcategoriedata:any;
  imageUrl:any;
  constructor(private route: ActivatedRoute,
              private societesService: SocietesService,
              private router: Router) { }

  
  ngOnInit(): void {
      this.getSociete(this.route.snapshot.params["id"]);
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
  getSociete(id?: string): void {
    this.societesService.getdetailsocieteById(id).then((data1) => {
      this.societe = data1;
      console.log('my ',this.societe);

      const idcategorie = this.societe.idcategorie;
      console.log('my data ',data1);
      this.societesService.getnomcategorie(this.societe.idcategorie).then((data3) => {
        this.nomcategoriedata = data3;
        console.log('my data 3 ',data3);
  
      });
      if(this.societe && this.societe.imageUrl){
        console.log('imageurl',this.societe.imageUrl);
        this.societesService.getImageUrl(this.societe.imageUrl).then((url) => {
          this.imageUrl = url;
          console.log('my img',this.imageUrl);

        })
        console.log('may img',this.imageUrl);
    
      }
    });

   
    
    

  }


  onBack() {
    this.router.navigate(['/societes']);
  }
}
