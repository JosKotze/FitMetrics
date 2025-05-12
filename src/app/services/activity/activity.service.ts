import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Map } from '../../models/Map';
import { Activity, ActivityDetails } from '../../api/FitMetricsApi';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ActivityService {
    private apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

    // getActivityById(userId: number, activityId: number): Observable<Activity> {
    //   return this.http.get<Activity>(`/api/users/${userId}/activities/${activityId}`);
    // }

    getActivityDetailsById(userId: number, activityId: number): Observable<ActivityDetails> {
      const url = `${this.apiUrl}/api/Activities/getActivityDetails`;
      const params = new HttpParams()
        .set('userId', userId.toString())
        .set('activityId', activityId.toString());
      return this.http.get<ActivityDetails>(url, { params });
    }

    // getActivityDetailsById(userId: number, activityId: number): Observable<Activity> {
    //   const url = `${this.apiUrl}/api/Activities/getActivityDetails/${userId}/${activityId}`
    //   const body =  {UserId: userId, ActivityId: activityId }; 
    //   return this.http.post<ActivityDetails>(url, body);
    // }
    // what is should look like:
    // https://localhost:7279/api/Activities/getActivityDetails?userId=1&activityId=14109970445
    
    // what it looks like:
    // https://localhost:7279/api/Activities/getActivityDetails/1/14109970445
    syncActivities(accessToken: string): Observable<any> {
        const url = `${this.apiUrl}/api/syncActivitiesFromStrava`;
        return this.http.post(url, { accessToken });
    }

    saveActivityMap(accessToken: string, activityId: number, userId: number) {
      const url = `${this.apiUrl}/api/saveActivityMap`;
      const body = { accessToken, activityId, userId };
      return this.http.post(url, body);
    }

    getActivityMap(accessToken: string | null, userId: number, activityId: number): Observable<Map> {
      const url = `${this.apiUrl}/api/Activities/getActivityMap`;
    
      const requestBody = {
        accessToken: accessToken,
        userId: userId,
        activityId: activityId
      };
    
      return this.http.post<Map>(url, requestBody);
    }  
}
