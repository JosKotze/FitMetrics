import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StravaAuthService {

  private clientId = '112649';
  private clientSecret = '0638ca5f727124b3ebd6ff2f650b478b00964874';
  private redirectUri = 'http://localhost:4200/stravaAuth';

  constructor(private http: HttpClient) { }

  exchangeAuthorizationCode(code: string): Observable<any> {
    const url = 'https://www.strava.com/api/v3/oauth/token';
    const body = new FormData();
    body.append('client_id', this.clientId);
    body.append('client_secret', this.clientSecret);
    body.append('code', code);
    body.append('grant_type', 'authorization_code');

    return this.http.post(url, body);
  }
}
