// auth.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../store/selectors/session.selector';
import { User } from '../../models/User';
import { setStartupData } from '../../store/actions/startup.actions';
import { Router } from 'express';
import { Startup } from '../../store/models/startup.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7279/api/'; // Replace with your API URL
  store = inject(Store)
  currentUser= signal<User | null>(null); //initial value will be null

  constructor(private http: HttpClient) { }

  login(model: any): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}Account/login`, model).pipe(
        map(user => {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                return user;
            }
            return null;
        })
    );
}

  register(model: any) {
    return this.http.post<User>(this.apiUrl + 'account/register', model).pipe(
      map(user => {
        if(user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUser.set(user);
        }
        return user;
      })
    )
  }

  logout() {
    localStorage.removeItem('user')
    this.currentUser.set(null);
  }

  getStartupData(userName: string){
    return this.http.get<Startup>(`${this.apiUrl}/startup/${userName}`);
  }

  updateAccessTokenLocalStorage(accesstoken: string) {

    localStorage.setItem('accesstoken', JSON.stringify(accesstoken));

  }

  isAuthenticated(): Observable<boolean> {
    return this.store.select(selectIsAuthenticated);
  }
}
