import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { retry, catchError, retryWhen, map} from 'rxjs/operators';

import { CreateProductDTO, Product, UpdateProductDTO } from './../models/product.model';
import { environment }from '../../environments/environment'
import { throwError, zip } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL = `${environment.API_URL}/api/products`;
  constructor(
    private http: HttpClient
  ) { }

  getAllProducts(limit?: number, offset?: number) {
    console.log(limit, offset)
    let params = new HttpParams();
    if(limit && offset){
      console.log('hola')
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
    .pipe(
      catchError((error: HttpErrorResponse) => {
        if(error.status === HttpStatusCode.InternalServerError){
          return throwError('Algo falla en el server');
        }
        if(error.status === HttpStatusCode.NotFound){
          return throwError('El producto no existe');
        }
        if(error.status === HttpStatusCode.Unauthorized){
          return throwError('no estas autorizado');
        }
        return throwError('Ups! algo salio mal')
      })
    )
  }

  getProductsByPage(limit: number, offset: number){
    return this.http.get<Product[]>(this.API_URL,{
      params:{limit,offset}
    })
    .pipe(
      retry(3),
      map(products => products.map(item => {
        return {
          ...item,
          taxes: .19*item.price
        }
      }))
    );
  }

  fetchReadAndUpdate(id: string, data:UpdateProductDTO){
    //Para tener dos observables y ejecutarlos al tiempo usamo zip
    return zip( // PETICIONES EN PARALELO
      this.getProduct(id),
      this.updateProduct(id,data)
    )
  }

  createProduct(data:CreateProductDTO){
    return this.http.post<Product>(this.API_URL,data)
  }

  updateProduct(id:string ,data:UpdateProductDTO){
    return this.http.put<Product>(`${this.API_URL}/${id}`,data)
  }

  deleteProduct(id: string){
    return this.http.delete<Boolean>(`${this.API_URL}/${id}`)
  }
}
