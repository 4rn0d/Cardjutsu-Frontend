import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import {CookieService} from "ngx-cookie-service";

@Injectable()
export class ApiInterceptor implements HttpInterceptor {

  constructor( public cookieService: CookieService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    request = request.clone({ withCredentials: true });
    const token = this.cookieService.get(".AspNetCore.Identity.Application");
    if (token != null) {
      request = request.clone({
        setHeaders: {
          'Authorization': 'Bearer ' + token
        }
      });
    }else{
      console.log("token rip")
    }
    return next.handle(request);
  }
}
