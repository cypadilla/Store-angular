import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { retry, retryWhen} from 'rxjs/operators';

import { CreateProductDTO, Product } from './../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  API_URL = 'https://young-sands-07814.herokuappapp.com/api/products'
  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    let params = new HttpParams();
    if(limit && offset){
      params = params.set('limit',limit);
      params = params.set('offset',offset);
    }
    return this.http.get<Product[]>(this.API_URL, { params })
    .pipe(
      retry(3)
    );
  }

  getProduct(id:string){
    return this.http.get<Product>(`${this.API_URL}/${id}`)
  }

  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(this.API_URL,{
      params:{limit,offset}
    })
    .pipe(
      retry(3)
    );
  }

  createProduct(data:CreateProductDTO){
    return this.http.post<Product>(this.API_URL,data)
  }

  updateProduct(id:string ,data:any){
    return this.http.put<Product>(`${this.API_URL}/${id}`,data)
  }

  deleteProduct(id: string){
    return this.http.delete<Boolean>(`${this.API_URL}/${id}`)
  }
}
