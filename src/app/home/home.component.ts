import { Component, Inject, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { selectAccessToken, selectAuthCode } from '../store/selectors/auth.selector';
import { Activity } from '../api/FitMetricsApi';
import { HomeService } from './home.service';
import { setAccessToken } from '../store/actions/auth.actions';
import { selectStartup } from '../store/selectors/startup.selector';


//import { ActivityService } from '../services/activity/activity.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  accessToken;

  isStravaAuthorized = false;
  responseMessage: string = '';
  activities: Activity[] = [];
  basicData: any;
  basicOptions: any;
  //fitMetricsApi = inject(FitMetricsApi);
  homeService = inject(HomeService);
  accessTokenFromLocalStorage: string | null = ''

  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.accessToken = this.store.select(selectAccessToken);
  }

  ngOnInit(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      this.accessTokenFromLocalStorage = localStorage.getItem('accesstoken');
    }
    if(this.accessTokenFromLocalStorage != null){
      this.store.dispatch(setAccessToken({accessToken: this.accessTokenFromLocalStorage}));
    }

    this.accessToken = this.store.select(selectAccessToken);

    this.accessToken.subscribe(accessToken => {
      console.log('Access Token in home:', accessToken);
    });

    this.accessToken.subscribe(accessToken => {
      if (!accessToken) {
        this.isStravaAuthorized = false;
        return;
      }

      this.isStravaAuthorized = true;

      // Fetch activities from the service
      // this.homeService.getSavedActivities().subscribe(
      //   (activities: Activity[]) => {
      //       this.activities = activities;
      //     },
      //     (error) => {
      //       this.responseMessage = `Error: ${error.message}`;
      //     }
      //   );

      this.store.select(selectStartup).subscribe(startup => {
        console.log('Current startup state:', startup);
      });
    });
  }
}
