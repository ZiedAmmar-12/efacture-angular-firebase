export class Prestationdevis{
 
    id_devis?: string;
    id?: string ;
    label?: string;
    references?: References[];
    totalht?: number;
    optiontva?: string;
    tva?: string;
    type_dev_fac?: string;
    timbrefiscal?: number;
    totalttc?: number;
    uid?:String|undefined;
    datecreation?: number;
    datemodification?: number;
    refid: any;
 }    
   

export class References{
    id?: string ;
    description?: string;
    quantite?: number;
    prix_unitaire_HT?: number;
    montant_HT?: number;
    uid:String|undefined;


}
 