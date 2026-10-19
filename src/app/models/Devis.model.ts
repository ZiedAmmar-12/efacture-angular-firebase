export class Devis{
 
  public id?: string ;
  public idsociete?: string;
  public idclient?: string ;
  public type_dev_fac?: string;
  public numdevis?: string;
  public label?: string;

  public references?: any;
  public totalht?: number;
  public optiontva?: string;
  public tva?: string;
  public timbrefiscal?: number;
  public totalttc?: number;
  public date_valid_fact?: Date;
  public uid?:String|undefined;
  public datecreation?: number;
  public datemodification?: number;
  nomsoicete: any;
  refid: any;
  numDevis: any;
  prespectivedata: any;
  
}    

export class DevisModel{
  devisItems?:DevisItems[]
  public id?: string ;
  public idsociete?: string;
  public idclient?: string ;
  public type_dev_fac?: string;
  public numdevis?: string;

  public date_valid_fact?: Date;
  public uid?:String|undefined;
  public datecreation?: number;
  public datemodification?: number;
  public totalAmount: number =0 ;

  nomsoicete: any;
  refid: any;
  numDevis: any;
  prespectivedata: any;
}
export class DevisItems{
  public label?: string;

  public references?: any;
  public totalht?: number;
  public optiontva?: string;
  public tva?: string;
  public timbrefiscal?: number;
  public totalttc?: number;
}
/*
export class Devis{
 
  public id?: string ;
  public idsociete?: string;
  public idclient?: string ;
  public type_dev_fac?: string;
  public numdevis?: string;
  items?:DevisItems[]
  public date_valid_fact?: Date;
  public uid?:String|undefined;
  public datecreation?: number;
  public datemodification?: number;
  nomsoicete: any;
  refid: any;
  numDevis: any;
  prespectivedata: any;
  
}    
export class DevisItems{
  public label?: string;

  public references?: any;
  public totalht?: number;
  public optiontva?: string;
  public tva?: string;
  public timbrefiscal?: number;
  public totalttc?: number;
}
  
  */
  
  
  
  
  
  
  
  