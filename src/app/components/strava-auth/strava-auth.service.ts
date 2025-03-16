import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, concatMap, Observable, switchMap, tap, throwError } from 'rxjs';
import { AppState } from '../../store/app.state';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StravaAuthService {
  private clientId = environment.stravaClientID;
  private clientSecret = environment.stravaClientSecret;

  constructor(private http: HttpClient, private store: Store<AppState>, private authService: AuthService) { }

  // exchangeAuthorizationCode(authCode: string): Observable<any> {
  //   return this.http.post<any>('https://www.strava.com/oauth/token', {
  //     client_id: 'YOUR_CLIENT_ID',
  //     client_secret: 'YOUR_CLIENT_SECRET',
  //     code: authCode,
  //     grant_type: 'authorization_code'
  //   }).subscribe(response => {
  //     if (response && response.access_token) {
  //       this.authService.setSession(
  //         response.access_token,
  //         response.expires_at,
  //         response.refresh_token
  //       );
  //     }
  //   });
  // }

  exchangeAuthorizationCode(code: string): Observable<any> {
    const url = 'https://www.strava.com/api/v3/oauth/token';
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  
    const body = new HttpParams()
      .set('client_id', this.clientId)
      .set('client_secret', this.clientSecret)
      .set('code', code)
      .set('grant_type', 'authorization_code');
  
    console.log('exchangeAuthorizationCode:');
    console.log('Request body:', body.toString());
    return this.http.post<any>(url, body.toString(), { headers }).pipe(
      tap(response => {
        console.log('Response from Strava:', response); // Log entire response
        this.authService.setSession(
        response.access_token,
        response.expires_at,
        response.refresh_token)
      }),
      catchError(error => {
        console.error('Error exchanging authorization code:', error);
        return throwError(() => error);
      })
    );
  }

}



