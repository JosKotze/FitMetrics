import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Map } from '../../models/Map';
import { Activity } from '../../api/FitMetricsApi';


@Injectable({
  providedIn: 'root'
})
export class ActivityService {
    private apiUrl = 'https://localhost:7279/api';
  constructor(private http: HttpClient) { }

    getActivityById(userId: number, activityId: number): Observable<Activity> {
      return this.http.get<Activity>(`/api/users/${userId}/activities/${activityId}`);
    }

    syncActivities(accessToken: string): Observable<any> {
        const url = `${this.apiUrl}/syncActivitiesFromStrava`;
        return this.http.post(url, { accessToken });
    }

    saveActivityMap(accessToken: string, activityId: number, userId: number) {
      const url = `${this.apiUrl}/saveActivityMap`;
      const body = { accessToken, activityId, userId };
      return this.http.post(url, body);
    }

    getActivityMap(accessToken: string, userId: number, activityId: number): Observable<Map> {
      const url = `https://localhost:7279/api/Activities/getActivityMap`;
    
      const requestBody = {
        accessToken: accessToken,
        userId: userId,
        activityId: activityId
      };
    
      return this.http.post<Map>(url, requestBody);
    }  
}
