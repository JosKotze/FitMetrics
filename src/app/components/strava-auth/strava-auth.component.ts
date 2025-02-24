import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { setAccessToken, setAthleteProfilePicture, setAuthCode, setStravaUserAuthDetails, setTestData } from '../../store/actions/auth.actions';
import { StravaAuthService } from './strava-auth.service';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-strava-auth',
  templateUrl: './strava-auth.component.html',
  styleUrls: ['./strava-auth.component.scss']
})
export class StravaAuthComponent implements OnInit {
  //112649
  //3d7ddf466da42cfe4771c371221025eaa06d3f5d

  notAuthFormGroup = new FormGroup({
    clientId: new FormControl<string | null>(null), // Set default value
    clientSecret: new FormControl<string | null>(null) // Set default value
  });

  redirectUri: string = 'http://localhost:4200/stravaAuth';
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

    this.currentRoute.queryParams.pipe(
      tap(params => {
        console.log('authcode: ', params['code']);
        if (params['code']) {
          this.authCode = params['code'];
          this.store.dispatch(setAuthCode({ authCode: this.authCode }));
        }
      }),
      catchError(error => {
        console.error('Error getting query parameters:', error);
        return of(null);
      })
    ).subscribe();


  }

  finalizeAuthorization(): void {
    if (this.authCode) {
      this.stravaAuthService.exchangeAuthorizationCode(this.authCode).subscribe(
        response => {
          console.log('Access Token: in component', response.access_token);
          if (response.access_token) {
            this.store.dispatch(setAccessToken({ accessToken: response.access_token }));
            this.store.dispatch(setAthleteProfilePicture({ athleteProfilePictureUrl: response.athlete.profile}))
            this.authService.updateAccessTokenLocalStorage(response.access_token);
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

  onSubmit(): void {
    const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${this.notAuthFormGroup.controls.clientId.value}&redirect_uri=${this.redirectUri}&response_type=code&scope=activity:read_all`;
    console.log(authorizationUrl);
    window.location.href = authorizationUrl;
    this.store.dispatch(setStravaUserAuthDetails({ clientId: this.notAuthFormGroup.controls.clientId.value, clientSecret: this.notAuthFormGroup.controls.clientId.value}))
  }
}
