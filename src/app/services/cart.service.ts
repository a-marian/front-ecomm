import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {  }


  addToCart(cartItem: CartItem){
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = new CartItem();

    if(this.cartItems.length > 0 ) {
      //find the item in the cart based on item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id)!;
      //check if we found it
      alreadyExistsInCart = (existingCartItem != undefined);
      }
      if (alreadyExistsInCart){
      existingCartItem.quantity++;
      } else{
        this.cartItems.push(cartItem);
      }
      //compute cart total price and total quantity
      this.computeCartTotals();

  }

    computeCartTotals(){
      let totalPriceValue: number = 0;
      let totalQuantityValue: number = 0;

      for (let currentCartItem of this.cartItems) {
        totalPriceValue += currentCartItem.quantity *  (currentCartItem.unitPrice || 0.0);
        totalQuantityValue += currentCartItem.quantity;
        console.log(`name: ${currentCartItem.name}, quantity=${currentCartItem.quantity},
         unitPrice=${currentCartItem.unitPrice}, subTotalPrice=${totalPriceValue}`);
      }

      this.totalPrice.next(totalPriceValue);
      this.totalQuantity.next(totalQuantityValue);

         console.log('Contents of the cart');
          for (let tempCartItem of this.cartItems) {
            const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice!;
            console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
          }

      console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
      console.log('----');
    }

  decrementQuantity(tempCartItem: CartItem) {
    tempCartItem.quantity--;
    if(tempCartItem.quantity === 0){
      this.remove(tempCartItem)
    } else {
      this.computeCartTotals();
    }
  }

  remove(tempCartItem: CartItem) {
    // get index of item in the array
    const itemIndex = this.cartItems.findIndex(tempCartItem => tempCartItem.id === tempCartItem.id);
    //if item is found remove item from array by index
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}
