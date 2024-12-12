import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Map } from '../../models/Map';


@Injectable({
  providedIn: 'root'
})
export class ActivityService {
    private apiUrl = 'https://localhost:7279/api/';
  constructor(private http: HttpClient) { }

//   getActivities(authCode: string): Observable<Activity[]> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${authCode}`);
//     return this.http.get<Activity[]>('https://localhost:7279/api/Activities', { headers });
//   }

    syncActivities(accessToken: string): Observable<any> {
        const url = `${this.apiUrl}/syncActivitiesFromStrava`; // Sync endpoint URL
        return this.http.post(url, { accessToken }); // Sending accessToken in the request body
    }

    saveActivityMap(accessToken: string, activityId: number, userId: number) {
      const url = `${this.apiUrl}/saveActivityMap`;
      const body = { accessToken, activityId, userId };
      return this.http.post(url, body);
    }
    
    getActivityMap(activityId: number, userId: number) {
      const url = `${this.apiUrl}/getActivityMap`;
      const params = { activityId: activityId.toString(), userId: userId.toString() }; // Ensure values are strings
      return this.http.get<Map>(url, { params });
    }
    
}
