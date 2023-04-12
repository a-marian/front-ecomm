import {Product} from "./product";

export class CartItem {

  id: number;
  name: string;
  imageUrl: string;
  unitPRice: number;
  quantity: number;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.name;
    this.imageUrl = product.imageUrl;
    this.unitPRice = product.unitPRice;
    this.quantity = 1;
  }
}
