import { Injectable, signal } from '@angular/core';
import { environment } from '../constants/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Activity } from '../api/FitMetricsApi';
import { PaginatedResult } from '../models/pagination';
import { response } from 'express';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  private apiUrl = environment.apiBaseUrl;
  paginatedResult = signal<PaginatedResult<Activity[]> | null>(null);

  constructor(private http: HttpClient) { }

  getPagedActivities(pageNumber: number, pageSize: number) {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

        //https://localhost:7279/api/Activities/getPagedActivities?pageNumber=1&PageSize=5
    this.http.get<Activity[]>(`${this.apiUrl}/api/Activities/getPagedActivities`, { observe: 'response', params })
      .subscribe({
        next: response => {
          const pagination = JSON.parse(response.headers.get('Pagination')!);
          this.paginatedResult.set({
            items: response.body as Activity[],
            pagination: pagination
          });
        },
        error: error => console.error('Failed to load paginated activities', error)
      });
  }

  getActivities(accessToken: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/api/Activities/getActivitiesFromStrava?accessToken=${accessToken}`);
  }

  getSavedActivities(): Observable<Activity[]> {
    return this.http.get<Activity[]>(`${this.apiUrl}/api/Activities/getSavedActivities`);
  }

  getActivitiesByType(type: string, userId: number) {
    const url = `${this.apiUrl}/api/Activities/geActivitiesByType?type=${type}&userId=${userId}`; // Append userId as a query parameter
    return this.http.get<Activity[]>(url);
  }

  getLatestActivity(userId: number){
    const url = `${this.apiUrl}/api/Activities/getLatestActivity?userId=${userId}`; // Append userId as a query parameter
    return this.http.get<Activity>(url);
  }
}
