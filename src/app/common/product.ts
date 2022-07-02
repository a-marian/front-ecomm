export class Product {
  id : number;
  sku: string;
  name: string;
  description: string;
  unitPrice: number;
  imageUrl: string;
  active: boolean;
  unitsInStock:number;
  dateCreated: Date;
  lastUpdate: Date;

  constructor() {
   this.id = 1;
   this.sku = "";
   this.name = "";
   this.description= "";
   this.unitPrice = 0.00;
   this.imageUrl= "";
   this.active = false;
   this.unitsInStock= 1;
   this.dateCreated= new Date();
   this.lastUpdate= new Date();
  }


}
