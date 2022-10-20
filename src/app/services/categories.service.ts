import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Category } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private API_URL = `${environment.API_URL}/api/categories`;
  constructor(
    private http: HttpClient
  ) { }

  getAll(limit?: number, offset?: number) {
    console.log(limit, offset)
    let params = new HttpParams();
    if(limit && offset){
      console.log('hola')
      params = params.set('limit',limit);
      params = params.set('offset',offset);
    }
    return this.http.get<Category[]>(`${this.API_URL}`, { params })
    .pipe(
      retry(3)
    );
  }
}
