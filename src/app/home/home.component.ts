import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppState } from '../store/app.state';
import { Store } from '@ngrx/store';
import { selectAcceesToken, selectAuthCode } from '../store/selectors/auth.selector';
//import { ActivityService } from '../services/activity/activity.service';
import { Activity, FitMetricsApi } from '../api/FitMetricsApi';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  accessToken$: Observable<string>;
  isStravaAuthorized = false;
  responseMessage: string = '';
  activities: Activity[] = [];
  basicData: any;
  basicOptions: any;

  constructor(private fitMetricsApi: FitMetricsApi, private http: HttpClient, private store: Store<AppState>) {
    this.accessToken$ = this.store.select(selectAcceesToken);
  }

  ngOnInit(): void {
    this.accessToken$.subscribe(accessToken => {
      if (!accessToken) {
        this.isStravaAuthorized = false;
        return;
      }

      this.isStravaAuthorized = true;

      this.fitMetricsApi.activitiesAll(accessToken).then(
        (response: Activity[]) => {
          console.log(response); // Log the response from the API
          this.activities = response;
          console.log(this.activities);
        },
        (error) => {
          console.error(error); // Log any errors
          // Handle errors if needed
        }
      );
    });
  }
}
