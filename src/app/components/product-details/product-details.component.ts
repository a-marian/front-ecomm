import { Component, OnInit } from '@angular/core';
import {Product} from "../../common/product";
import {ProductService} from "../../services/product.service";
import {ActivatedRoute} from "@angular/router";
import {CartService} from "../../services/cart.service";
import {CartItem} from "../../common/cart-item";
import { Observable, pipe } from "rxjs";
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  product: Product = new Product();

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit() {
   const theProductId = Number(this.route.snapshot.paramMap.get('productId'));
     this.productService.getProduct(theProductId).subscribe(
         data => { this.product = data;})
  }

  addToCart(){
    console.log(`Adding to cart: ${this.product.productName}, ${this.product.unitPrice} `);
    const cartItem = new CartItem(this.product.productId, this.product.productName,
                              this.product.imageUrl, this.product.unitPrice);
    this.cartService.addToCart(cartItem);
  }
}
