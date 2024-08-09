import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, concatMap, Observable, switchMap, tap, throwError } from 'rxjs';
import { AppState } from '../../store/app.state';
import { setAccessToken } from '../../store/actions/auth.actions';



@Injectable({
  providedIn: 'root'
})
export class StravaAuthService {
  private clientId = '112649';
  private clientSecret = '3d7ddf466da42cfe4771c371221025eaa06d3f5d';
  private redirectUri = 'http://localhost:4200/stravaAuth';
  accessToken = '';


  constructor(private http: HttpClient, private store: Store<AppState>) { }

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
      }),
      catchError(error => {
        console.error('Error exchanging authorization code:', error);
        return throwError(() => error);
      })
    );
  }

}
