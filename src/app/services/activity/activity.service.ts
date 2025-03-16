import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Map } from '../../models/Map';
import { Activity } from '../../api/FitMetricsApi';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ActivityService {
    private apiUrl = environment.apiBaseUrl;
  constructor(private http: HttpClient) { }

    getActivityById(userId: number, activityId: number): Observable<Activity> {
      return this.http.get<Activity>(`/api/users/${userId}/activities/${activityId}`);
    }

    syncActivities(accessToken: string): Observable<any> {
        const url = `${this.apiUrl}/api/syncActivitiesFromStrava`;
        return this.http.post(url, { accessToken });
    }

    saveActivityMap(accessToken: string, activityId: number, userId: number) {
      const url = `${this.apiUrl}/api/saveActivityMap`;
      const body = { accessToken, activityId, userId };
      return this.http.post(url, body);
    }

    getActivityMap(accessToken: string, userId: number, activityId: number): Observable<Map> {
      const url = `${this.apiUrl}/api/Activities/getActivityMap`;
    
      const requestBody = {
        accessToken: accessToken,
        userId: userId,
        activityId: activityId
      };
    
      return this.http.post<Map>(url, requestBody);
    }  
}
