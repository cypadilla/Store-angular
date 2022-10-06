import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { CreateProductDTO, Product } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  API_URL = 'https://young-sands-07814.herokuapp.com/api/products'
  constructor(
    private http: HttpClient
  ) { }

  getAllProducts() {
    return this.http.get<Product[]>(this.API_URL);
  }

  getProduct(id:string){
    return this.http.get<Product>(`${this.API_URL}/${id}` )
  }

  createProduct(data:CreateProductDTO){
    return this.http.post<Product>(this.API_URL,data)
  }
}
