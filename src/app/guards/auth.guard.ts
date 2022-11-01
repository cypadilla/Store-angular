import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
// import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    // private tokenService:TokenService,
    private AuthService:AuthService,
    private router:Router
  ){

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      // Validar el token solamente
      // const token = this.tokenService.getToken();
    // if(!token){
    //   this.router.navigate(['/home']);
    //   return false
    // }
    // return true;

    return this.AuthService.user$
    .pipe(
      map(user => {
        if(!user){
          this.router.navigate(['/home']);
          return false
        }
        return true
      })
    )
  }

}
