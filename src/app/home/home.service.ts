import { Injectable, signal } from '@angular/core';
import { environment } from '../constants/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
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
//https://localhost:7279/api/Activities/syncActivities?userId=1&accessToken=%221f590d15f92267e707441065a616dddf07c27ca7%22
//https://localhost:7279/api/Activities/syncActivities?userId=1&accessToken=1f590d15f92267e707441065a616dddf07c27ca7
  
  // syncActivities(userId: number, accessToken: string): Observable<string> {    
  //   return this.http.get<string>(`${this.apiUrl}/api/Activities/syncActivities?userId=${userId}&accessToken=${accessToken}`);
  // }
// Inside your service class
syncActivities(userId: number, accessToken: string): Observable<any> {
  console.log('Service call started');
  return this.http.get<string>(`https://localhost:7279/api/Activities/syncActivities?userId=${userId}&accessToken=${accessToken}`, { responseType: 'text' as 'json' })
    .pipe(
      tap(() => console.log('Service call successful')),
      catchError((error) => {
        console.error('Service call failed', error);
        return throwError(error);
      })
    );
}



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

  getActivitiesByTypeByYear(year: number, type: string, userId: number){
    const url = `${this.apiUrl}/api/Activities/getActivityByTypeByYear?year=${year}&type=${type}&userId=${userId}`; // Append userId as a query parameter
    return this.http.get<Activity[]>(url);
  }

  getActivitiesByType(type: string, userId: number) {
    const url = `${this.apiUrl}/api/Activities/getActivitiesByType?type=${type}&userId=${userId}`; // Append userId as a query parameter
    return this.http.get<Activity[]>(url);
  }

  getLatestActivity(userId: number){
    const url = `${this.apiUrl}/api/Activities/getLatestActivity?userId=${userId}`; // Append userId as a query parameter
    return this.http.get<Activity>(url);
  }
}
