import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { selectAccessToken, selectAuthCode } from '../store/selectors/auth.selector';
import { Activity } from '../api/FitMetricsApi';
import { HomeService } from './home.service';


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


  constructor(private http: HttpClient, private store: Store<AppState>) {
    this.accessToken = this.store.select(selectAccessToken);
  }

  ngOnInit(): void {

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
      this.homeService.getSavedActivities().subscribe(
        (activities: Activity[]) => {
            this.activities = activities;
          },
          (error) => {
            this.responseMessage = `Error: ${error.message}`;
          }
        );

      // this.homeService.getActivities(accessToken).subscribe(
      //   (activities: Activity[]) => {
      //     this.activities = activities;
      //   },
      //   (error) => {
      //     this.responseMessage = `Error: ${error.message}`;
      //   }
      // );
      
    });
  }
}
