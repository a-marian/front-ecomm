import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ProductListComponent } from './product-list/product-list.component';
import {HttpClientModule} from "@angular/common/http";
import {ProductService} from "./services/product.service";
import {Routes, RouterModule, Router} from "@angular/router";
import { ProductCategoryMenuComponent } from './components/product-category-menu/product-category-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import {NgbPaginationModule} from "@ng-bootstrap/ng-bootstrap";
import { CartStatusComponent } from './components/cart-status/cart-status.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import {ReactiveFormsModule} from "@angular/forms";

import { MemberPageComponent } from './components/member-page/member-page.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';



const routes: Routes = [
  {path: 'order-history', component: OrderHistoryComponent},
  {path: 'members', component: MemberPageComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'product/:productId', component: ProductDetailsComponent},
  {path: 'search/:keyword', component: ProductListComponent},
  {path: 'category/:categoryId', component: ProductListComponent},
  {path: 'products/category/:categoryId', component: ProductListComponent},
  {path: 'products', component: ProductListComponent},
  {path: '', redirectTo: '/products', pathMatch:'full'},
  {path: '**', redirectTo: '/products', pathMatch:'full'}
];
@NgModule({
  declarations: [
    AppComponent,
    ProductListComponent,
    ProductCategoryMenuComponent,
    SearchComponent,
    ProductDetailsComponent,
    CartStatusComponent,
    CartDetailsComponent,
    CheckoutComponent,
    MemberPageComponent,
    OrderHistoryComponent
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    NgbPaginationModule,
    ReactiveFormsModule
  ],
  providers: [ProductService],
  bootstrap: [AppComponent]
})
export class AppModule { }
