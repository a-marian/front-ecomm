import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ShopFormService} from "../../services/shop-form.service";
import {Country} from "../../common/country";
import {State} from "../../common/state";
import {EcommValidator} from "../../validators/ecomm-validator";
import {CartService} from "../../services/cart.service";
import {CheckoutService} from "../../services/checkout.service";
import {Router} from "@angular/router";
import {Order} from "../../common/order";
import {OrderItem} from "../../common/order-item";
import {Purchase} from "../../common/purchase";
import { environment } from 'src/environments/environment';
import { PaymentInfo } from 'src/app/common/payment-info';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[]= [];
  creditCardMonths: number[]= [];
  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  storage: Storage = sessionStorage;

   // initialize Stripe API
   stripe = Stripe(environment.stripePublishableKey);

   paymentInfo: PaymentInfo = new PaymentInfo();
   cardElement: any;
   displayError: any = "";
   isDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder,
              private shopFormService: ShopFormService,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { }


  ngOnInit(): void {

  this.setupStripePaymentForm();

    this.reviewCartDetails();

    // read customer email from browser storage
   let customerEmail = JSON.parse(this.storage.getItem('userEmail') || '');

    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved card credit months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      });

    this.shopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieve card credit years: "+ JSON.stringify(data));
        this.creditCardYears = data;
    });

    this.shopFormService.getCountries().subscribe(
      data => {
        console.log("retrieve countries: " + JSON.stringify(data));
        this.countries = data;
      });

  }

    setupStripePaymentForm() {
      // get a handle to stripe elements
      var elements = this.stripe.elements();
      // Create a card element ... and hide the zip-code field
      this.cardElement = elements.create('card', { hidePostalCode: true });
      // Add an instance of card UI component into the 'card-element' div
      this.cardElement.mount('#card-element');
      // Add event binding for the 'change' event on the card element
      this.cardElement.on('change', (event) => {
        // get a handle to card-errors element
        this.displayError = document.getElementById('card-errors');
        if (event.complete) {
          this.displayError.textContent = "";
          } else if (event.error) {
          // show validation error to customer
          this.displayError.textContent = event.error.message;
        }
        });

    }

    reviewCartDetails() {

      // subscribe to cartService.totalQuantity
      this.cartService.totalQuantity.subscribe(
        totalQuantity => this.totalQuantity = totalQuantity
      );

      // subscribe to cartService.totalPrice
      this.cartService.totalPrice.subscribe(
        totalPrice => this.totalPrice = totalPrice
      );

    }

  get firstName(){ return this.checkoutFormGroup.get('customer.firstName')}
  get lastName(){ return this.checkoutFormGroup.get('customer.lastName')}
  get email(){ return this.checkoutFormGroup.get('customer.email')}

  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street')}
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city')}
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode')}
  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country')}
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state')}

  get billingAddressStreet(){ return this.checkoutFormGroup?.get('billingAddress.street')}
  get billingAddressCity(){ return this.checkoutFormGroup?.get('billingAddress.city')}
  get billingAddressZipCode(){ return this.checkoutFormGroup?.get('billingAddress.zipCode')}
  get billingAddressCountry(){ return this.checkoutFormGroup?.get('billingAddress.country')}
  get billingAddressState(){ return this.checkoutFormGroup?.get('billingAddress.state')}

  get creditCardType(){ return this.checkoutFormGroup?.get('creditCard.type')}
  get creditCardName(){ return this.checkoutFormGroup?.get('creditCard.name')}
  get creditCardNumber(){ return this.checkoutFormGroup?.get('creditCard.number')}
  get creditCardSecurityCode(){ return this.checkoutFormGroup?.get('creditCard.securityCode')}

    copyShippingAddressToBillingAddress(event: any){

      if(event.target.checked) {
        this.checkoutFormGroup?.controls['billingAddressStates']
          .setValue(this.checkoutFormGroup?.controls['shippingAddress'].value);
        this.billingAddressStates = this.shippingAddressStates;
      } else {
        this.checkoutFormGroup?.controls['billingAddress'].reset();
        this.billingAddressStates = [];
      }
    }

    onSubmit() {
      console.log("Handling the submit button");
      console.log(this.checkoutFormGroup?.get('customer')?.value);
      console.log(this.checkoutFormGroup?.get('shippingAddress')?.value.country.name);
      if(this.checkoutFormGroup?.invalid){
        this.checkoutFormGroup?.markAllAsTouched();
        return;
      }
      console.log(this.checkoutFormGroup?.get('customer')?.value);
      console.log("Email address is " + this.checkoutFormGroup?.get('customer')?.value.email);
      console.log("Shipping address state is :" + this.checkoutFormGroup?.get('shippingAddress')?.value.state.name);
      console.log("Billing address state is :" + this.checkoutFormGroup?.get('billingAddress')?.value.country.name);

      // set up order
      let order = new Order();
      order.totalPrice = this.totalPrice;
      order.totalQuantity = this.totalQuantity;

      //get cart items
      const cartItems = this.cartService.cartItems;

      //create orderITems from cartItems
      /// long way
      /* let orderItems: OrderItem[] = [];
        for (let i=0; i < cartItems.length; i++){
        orderItems[i] = new OrderItem(cartItems[i]);
      } */
      /// short way
      let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

      //set up purchase
      let purchase = new Purchase();
      //populate purchase

      //populate customer
      purchase.customer = this.checkoutFormGroup.controls['customer'].value;

      //populate purchase -- shipping address
      purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
      const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
      const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
      purchase.shippingAddress.state = shippingState.name;
      purchase.shippingAddress.country = shippingCountry.name;

      //populate purchase 00 billing address
      purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
      const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
      const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
      purchase.billingAddress.state = billingState.name;
      purchase.billingAddress.country = billingCountry.name;

      //populate purchase - order and ortderITems
      purchase.order = order;
      purchase.orderItems = orderItems;



      // call REST API via checkoutservice
      this.checkoutService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your tracked number: ${response.orderTrackingNumber}`);
          //reset cart
          this.resetCart();
        },
        error: err => {alert(`There was an error: ${err.message}`);
        }
      })
    }

   resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    //reset form data
    this.checkoutFormGroup.reset();
    // navigate back to the product page
    this.router.navigateByUrl("/products");
  }


    handleMonthsAndYears(){
      const creditCardFormGroup = this.checkoutFormGroup?.get('creditCard');
      const currentYear : number = new Date().getFullYear();
      const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

      let startMonth;

      if (currentYear === selectedYear){
        startMonth = new Date().getMonth() + 1;
      } else {
        startMonth = 1;
      }
      this.shopFormService.getCreditCardYears();
    }

    getStates(e: any) {
      console.log(e.target.value);

      /**
      console.log(e.target.value);
      console.log(this.checkoutFormGroup?.get(formGroupName)?.value.country.code);
      const formGroup = this.checkoutFormGroup?.get(formGroupName);

      const countryCode = formGroup?.value.country.code;
      const countryName = formGroup?.value.country.name;

      console.log(`${formGroupName} country code: ${countryCode}`);
      console.log(`${formGroupName} country name: ${countryName}`);

      this.shopFormService.getStates(countryCode).subscribe(
        data => {
          if (formGroupName === 'shippingAddress') {
            this.shippingAddressStates = data;
          } else {
            this.billingAddressStates = data;
          }
          //select first item by default
          formGroup?.get('state')?.setValue(data[0]);
        });
       **/
    }
}
