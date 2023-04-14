import { Component, OnInit } from '@angular/core';
import {ProductService} from "../services/product.service";
import {Product} from "src/app/common/product";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  thePageNumber: number = 1;
  thePageSize: number = 10;
  theTotalElements: number = 0;

  previousKeyword: string | null = null;



  constructor(private productService: ProductService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts(){
   this.searchMode = this.route.snapshot.paramMap.has('keyword');
   if(this.searchMode){
     this.handleProductSearch();
   } else {
     this.handleProductList();
   }
  }

  handleProductSearch(){

    const theKeyword: string | null = this.route.snapshot.paramMap.get('keyword');

    //if we have a different keyword tha previous then set thePageNumber to 1
    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;
    console.log(`keyword=${theKeyword}, thePageNumber=${this.thePageNumber}`);

    //now search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                                this.thePageSize,
                                                theKeyword).subscribe(this.processResult());
  }

  handleProductList(){
    //Check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //Get the id param string,  convert string to a number using the + symbol
      this.currentCategoryId =  +this.route.snapshot.paramMap.has('id');
    }else {
      //if not category id is not available ... default to category 1
      this.currentCategoryId = 1;
    }
    //Check if we have a different category than previous
    //note: Angular will reuse a component if it is currently
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber= 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    //now get the products for the given category Id
    return this.productService.getProductListPaginate(this.thePageNumber -1,
                                                this.thePageSize,
                                                this.currentCategoryId)
      .subscribe(data => {this.products = data});
  }

  processResult() {
    return data => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(pageSize: number){
    this.thePageSize = pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }
  /**
  addToCart(product: Product) {
    console.log(`Adding to cart: ${product.name}`);
    const cartItem = new CartItem(product);
    this.cartService.addToCart(cartItem);
  }

*/
}
