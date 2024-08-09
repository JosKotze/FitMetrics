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
    return this.http.get<Activity[]>(`${this.apiUrl}/api/Activities?accessToken=${accessToken}`);
  }
}
