// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { Activity } from '../../api/FitMetrics_api';

// @Injectable({
//   providedIn: 'root'
// })
// export class ActivityService {

//   constructor(private http: HttpClient) { }

//   getActivities(authCode: string): Observable<Activity[]> {
//     const headers = new HttpHeaders().set('Authorization', `Bearer ${authCode}`);
//     return this.http.get<Activity[]>('https://localhost:7279/api/Activities', { headers });
//   }
// }
