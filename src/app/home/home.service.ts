import { Injectable } from '@angular/core';
import { environment } from '../constants/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../api/FitMetricsApi';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = environment.apiBaseUrl;

  constructor(private http: HttpClient) { }

  getActivities(accessToken: string): Observable<Activity[]> {
    // Correct URL path
    return this.http.get<Activity[]>(`${this.apiUrl}/api/Activities/getActivitiesFromStrava?accessToken=${accessToken}`);
  }

  getSavedActivities(): Observable<Activity[]> {
    // Correct URL path
    return this.http.get<Activity[]>(`${this.apiUrl}/api/Activities/getSavedActivities`);
  }

  getActivitiesByType(type: string, userId: number) {
    const url = `${this.apiUrl}/api/Activities/geActivitiesByType?type=${type}&userId=${userId}`; // Append userId as a query parameter
    return this.http.get<Activity[]>(url);
  }
}
