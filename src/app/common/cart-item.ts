import {Product} from "./product";

export class CartItem {
  public id?: number;
  public name?: string;
  public imageUrl?: string;
  public unitPrice?: number;
  public quantity: number=1;

  constructor(product: Product) {
    this.id = product.id;
    this.name = product.productName;
    this.imageUrl = product.imageUrl;
    this.unitPrice = product.unitPrice;
    this.quantity = 1;
  }
}
