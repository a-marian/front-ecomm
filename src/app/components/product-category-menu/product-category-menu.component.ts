import { Component, OnInit } from '@angular/core';
import {ProductService} from "../../services/product.service";
import {Category} from "../../common/category";

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.css']
})
export class ProductCategoryMenuComponent implements OnInit {

  categories: Category[] = [];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.listProductCategories();
  }

  private listProductCategories():void {
    this.productService.getCategories()
    .subscribe(data => { this.categories = data});
  }

}
