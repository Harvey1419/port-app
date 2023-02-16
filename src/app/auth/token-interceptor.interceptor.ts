import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private cookie: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.cookie.get('token')
    if(token){
      const httpOptions = request.clone({
        setHeaders: {
          token: `${token}`
        }
      })
      return next.handle(httpOptions).pipe(
        tap(event => console.log('Request: ',event))
      );
    }
    console.log('?');
    return next.handle(request)
  }
}
