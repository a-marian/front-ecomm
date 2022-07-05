import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import {ProductCategory} from "../common/product-category";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl = 'http://localhost:8080/api/product-category';

  constructor(private httpClient: HttpClient) {}

  getProduct(theProductId: number): Observable<Product> {
    //to build url based on product id
    const productUrl = `${this.baseUrl}/${theProductId}`;
    console.log(this.httpClient.get<Product>(productUrl));
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number,
                          thePageSize: number,
                          theCategoryId: number): Observable<GetResponseProducts> {
    //need to build URL based on categoryId, page and size
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
                      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string | Observable<Product>[]) {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
    }

  searchProductsPaginate(thePage: number,
                         thePageSize: number,
                         theKeyword?: string | null): Observable<GetResponseProducts> {
    //need to build URL based on keyword, page and size
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
      +`&page=${thePage}&size=${thePageSize}`;

    return this.httpClient.get<GetResponseProducts>(searchUrl);

  }

  private getProducts(searchUrl : string): Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }

  getProductCategories(): Observable<ProductCategory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

}

  interface GetResponseProducts {
    _embedded: {
      products: Product[];
    }
  }

  interface GetResponseProductCategory {
    _embedded: {
      productCategory: ProductCategory[];
    }
    page: {
      size:number,
      totalElements: number,
      totalPages: number,
      number: number
    }
  }
