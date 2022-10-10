import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // nos deja correr un proceso sin tener que modificar la respuesta

@Injectable()
export class TimeInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const start = performance.now();

    return next
    .handle(request)
    .pipe(
      tap( response => {
        const time = (performance.now() - start + 'ms');
        console.log(request.url,time);
      })
    );
  }
}
