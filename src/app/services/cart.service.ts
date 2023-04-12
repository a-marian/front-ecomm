import { Injectable } from '@angular/core';
import {CartItem} from "../common/cart-item";
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CartService {

  //reference to browser storage
  storage: Storage = sessionStorage;
  //localStorage: Storage = localStorage;

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {
    let data = JSON.parse(this.storage.getItem('cartItems') || '{}');
    if(data != null){
      this.cartItems = data;
      //compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(cartItem: CartItem){
    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: any = undefined;
    console.log(cartItem)
    if(this.cartItems.length > 0 ) {
      //find the item in the cart based on item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === cartItem.id);

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
      totalPriceValue += currentCartItem.quantity *  currentCartItem.unitPRice;
      totalQuantityValue += currentCartItem.quantity;
      console.log(`name: ${currentCartItem.name}, quantity=${currentCartItem.quantity},
       unitPrice=${currentCartItem.unitPRice}, subTotalPrice=${totalPriceValue}`);
    }

    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');

    //persist cart data
    this.persistCartItems();
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
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
    if(itemIndex > 1){
      this.cartItems.splice(itemIndex, 1);
      this.computeCartTotals();
    }
  }

}
