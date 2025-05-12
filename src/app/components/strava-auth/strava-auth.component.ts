import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { setAccessToken, setAthleteProfilePicture, setAuthCode, setStravaUserAuthDetails, setTestData } from '../../store/actions/auth.actions';
import { StravaAuthService } from './strava-auth.service';
import { catchError, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-strava-auth',
  templateUrl: './strava-auth.component.html',
  styleUrls: ['./strava-auth.component.scss']
})
export class StravaAuthComponent implements OnInit {
  redirectUri: string = `${environment.redirectURL}/stravaAuth`;
  authCode: string = '';
  accessTokenCheck$ = new Observable<string | null>();
  successMessage: string = '';
  authService = inject(AuthService)

  authorized: boolean = false;

  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
    private store: Store<AppState>,
    private stravaAuthService: StravaAuthService
  ) {}

  ngOnInit(): void {
    console.log("Redirect URL: ", this.redirectUri);
    console.log('PROD:', environment.production);
  
    this.currentRoute.queryParams.pipe(
      tap(params => {
        console.log('authcode: ', params['code']);
      }),
      filter(params => !!params['code']), // Ensure 'code' exists before proceeding
      map(params => params['code']), // Extract code
      tap(code => {
        this.authCode = code;
        this.store.dispatch(setAuthCode({ authCode: code }));
      }),
      switchMap(() => this.stravaAuthService.exchangeAuthorizationCode(this.authCode)), // Call finalize process
      catchError(error => {
        console.error('Error during authorization process:', error);
        return of(null);
      })
    ).subscribe(response => {
      if (response && response.access_token) {
        console.log("Expires at " + response.expires_at);
        console.log('Access Token:', response.access_token);
  
        this.store.dispatch(setAccessToken({ accessToken: response.access_token }));
        this.store.dispatch(setAthleteProfilePicture({ athleteProfilePictureUrl: response.athlete.profile }));
        this.authService.updateAccessTokenLocalStorage(response.access_token, response.expires_at, response.refresh_token);
        this.successMessage = 'Successfully authorized';
        this.authorized = true;
      } else {
        console.error('Access token is undefined in response');
      }
    });
  }
  

  finalizeAuthorization(): void {
    if (this.authCode) {
      this.stravaAuthService.exchangeAuthorizationCode(this.authCode).subscribe(
        response => {
          console.log("Expires at "+response.expires_at)
          console.log('Access Token: in component', response.access_token);
          if (response.access_token) {
            this.store.dispatch(setAccessToken({ accessToken: response.access_token }));
            this.store.dispatch(setAthleteProfilePicture({ athleteProfilePictureUrl: response.athlete.profile}))
            this.authService.updateAccessTokenLocalStorage(response.access_token, response.expires_at, response.refresh_token);
            this.successMessage = 'Successfully authorized'
            this.authorized = true;
          } else {
            console.error('Access token is undefined in response');
          }
        },
        error => {
          console.error('Error:', error);
        }
      );
    } else {
      console.warn('No authorization code available');
    }
  }

  signInToStrava(): void {
    const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${environment.stravaClientID}&redirect_uri=${this.redirectUri}&response_type=code&scope=activity:read_all`;
    console.log(authorizationUrl);
    window.location.href = authorizationUrl;
    this.store.dispatch(setStravaUserAuthDetails({ clientId: environment.stravaClientID, clientSecret: environment.stravaClientSecret}))
  }
}
