import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { setAccessToken, setAuthCode } from '../../store/actions/auth.actions';
import { StravaAuthService } from './strava-auth.service';
import { response } from 'express';
import { error } from 'console';

@Component({
  selector: 'app-strava-auth',
  templateUrl: './strava-auth.component.html',
  styleUrl: './strava-auth.component.scss'
})
export class StravaAuthComponent implements OnInit {

  notAuthFormGroup = new FormGroup({
    clientId: new FormControl<string>(''),
    clientSecret: new FormControl<string>('')
  });


  clientId = this.notAuthFormGroup.controls.clientId.value;
  clientSecret = this.notAuthFormGroup.controls.clientSecret.value;
  redirectUri: string = 'http://localhost:4200/stravaAuth';

  code: string = '';
  constructor(
    private router: Router,
    private currentRoute: ActivatedRoute,
    private store: Store<AppState>,
    private stravaAuthService: StravaAuthService
  ) {}
  
  ngOnInit(): void {
    this.currentRoute.queryParams.subscribe(params => {
      this.code = params['code']; // Extract the value of the 'code' query parameter
      console.log('Code:', this.code);
    });

    if (this.code) {
      // Dispatch action to save the code in the state
      //this.store.dispatch(setAuthCode({ code: this.code }));
      this.stravaAuthService.exchangeAuthorizationCode(this.code).subscribe(
        response => {
          this.store.dispatch(setAccessToken({ accessToken: response.access_token }));
          this.router.navigate(['/'])
        },
        error => {
          console.error('Error exchanging code:', error);
        }
      )
    }
  }

  onSubmit(): void{
    console.log(this.notAuthFormGroup.controls.clientId.value + ' | ' + this.notAuthFormGroup.controls.clientSecret.value )
    //event.preventDefault();

    const authorizationUrl = `https://www.strava.com/oauth/authorize?client_id=${this.notAuthFormGroup.controls.clientId.value}&redirect_uri=${this.redirectUri}&response_type=code&scope=activity:read_all`;
    
    console.log(authorizationUrl)
    // You can use these variables directly in your Angular template
    window.location.href = authorizationUrl;
  }
}
