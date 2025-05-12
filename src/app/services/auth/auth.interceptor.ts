import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from './auth.service'; // Make sure you have an AuthService to get the token
import { MessageService } from 'primeng/api';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.authService.getToken();
    console.log('Interceptor token:', token);
    console.log('Request URL:', req.url);
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Request with Authorization header:', req.headers.get('Authorization'));
    } else {
      console.log('No token found, request sent without Authorization');
    }
  
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.log('401 error detected, logging out');
          this.authService.setUnauthorizedHandled(true);
          this.authService.logout();
          this.router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }
  showMessage(severity: string, message: string) {
    this.messageService.add({
      key: 'confirm',
      sticky: true,
      severity,
      summary: message,
    });
    setTimeout(() => {
      this.messageService.clear('confirm');
    }, 3000); // Clear message after 3 seconds
  }
}
