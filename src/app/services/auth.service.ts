import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = `${environment.API_URL}/api/auth`;

  constructor(
    private http:HttpClient
  ) { }

  login(email:string, password:string){
    return this.http.post<Auth>(`${this.API_URL}/login`,{email,password})
  }

  profile(token: string){
    const headers = new HttpHeaders();
    headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.API_URL}/profile`, {
      headers:{
        Authorization:`Bearer ${token}`,
        'Content-type':'application/json'
      }
    })
  }

  loginAndGet(email:string, password:string){
    return this.login(email,password)
    .pipe(
      //SwitchMap nos permite evitar el callback hell en este caso luego de la coma se puede agregar otro switch VARIAS DEPENDENCIAS
      switchMap((token) => this.profile(token.access_token))
    )
  }
}
