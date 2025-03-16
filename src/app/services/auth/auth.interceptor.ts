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

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Retrieve token from AuthService (e.g., localStorage, sessionStorage, or state)
    let token = this.authService.getToken();
    if (token) {
      // Clone the request to add the Authorization header
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(req).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401) {
            this.authService.setUnauthorizedHandled(true);
            //this.showMessage(
           //     'error',
           //     'You are not authorized. Please log in.'
           // );

            this.authService.logout();
            this.router.navigate(['/login']);
          }
          return throwError(error);  // Continue the response flow
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
