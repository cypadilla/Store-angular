import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Auth } from '../models/auth.model';
import { User } from '../models/user.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_URL = `${environment.API_URL}/api/auth`;
  private user = new BehaviorSubject< User | null >(null);
  user$ = this.user.asObservable();

  constructor(
    private http:HttpClient,
    private tokenService:TokenService
  ) { }

  login(email:string, password:string){
    return this.http.post<Auth>(`${this.API_URL}/login`,{email,password})
    .pipe(
      tap(
        response => {
          this.tokenService.saveToken(response.access_token)
        })
    );
  }

  profile(){
    // const headers = new HttpHeaders();
    // headers.set('Authorization', `Bearer ${token}`);
    return this.http.get<User>(`${this.API_URL}/profile`)
    .pipe(
      tap( user => this.user.next(user))
    );
  }

  /**
   * "Login and get the profile, but only if the login was successful."
   *
   * The switchMap operator is a combination of the switch and map operators. It takes the result of
   * the first observable and passes it to the second observable. If the first observable emits a new
   * value, the second observable is cancelled and a new observable is created
   * @param {string} email - The email address of the user.
   * @param {string} password - The password of the user.
   * @returns The profile of the user
   */
  loginAndGet(email:string, password:string){
    return this.login(email,password)
    .pipe(
      //SwitchMap nos permite evitar el callback hell en este caso luego de la coma se puede agregar otro switch VARIAS DEPENDENCIAS
      switchMap(() => this.profile())
    )
  }

  logOut(){
    this.tokenService.removeToken();
  }
}
