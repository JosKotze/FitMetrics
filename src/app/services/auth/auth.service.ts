;// auth.service.ts
import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../../store/selectors/session.selector';
import { User } from '../../models/User';
import { Startup } from '../../store/models/startup.model';
import { setAccessToken } from '../../store/actions/auth.actions';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl
  private logoutTimer: any;
  store = inject(Store)
  currentUser= signal<User | null>(null); //initial value will be null
  private userKey = 'user';

  public isUnauthorizedHandled = false;

  constructor(private http: HttpClient, private router: Router) { }

  login(model: any): Observable<User | null> {
    return this.http.post<User>(`${this.apiUrl}/api/Account/login`, model).pipe(
        map(user => {
            if (user) {
                localStorage.setItem('user', JSON.stringify(user));
                console.log('Is token expired?', this.isTokenExpired());
                this.isUnauthorizedHandled = false
                return user;
            }
            return null;
        })
    );
  }

  register(model: any): Observable<User | null>  {
    return this.http.post<User>(`${this.apiUrl}/api/Account/register`, model).pipe(
      map(user => {
        if(user) {
          localStorage.setItem('user', JSON.stringify(user));
          return user;
          //this.currentUser.set(user);
        }
        return null;
      })
    )
  }

  saveUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  // Get user data
  getUser(): User | null {
    const userJson = localStorage.getItem(this.userKey);
    return userJson ? JSON.parse(userJson) : null;
  }

  getToken(): string | null {
    const user = this.getUser();
    
    return user ? user.token : null;
  }

  getDecodedToken(): any {
    const token = this.getToken();
    if (!token) return null;
    return jwtDecode(token);
  }

  isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();
    if(!decodedToken || !decodedToken.exp) return true;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decodedToken.exp < currentTime;
  }

  checkTokenExpiration() {
    if (this.isTokenExpired()) {
      this.logout();
    }
  }

  logout() {
    localStorage.removeItem('user') // could remove
    this.currentUser.set(null);
    localStorage.removeItem('access_token'); // will be able to remove following in future
    localStorage.removeItem('expires_at');
    localStorage.removeItem('refresh_token');
    this.router.navigate(['/login']);

    this.isUnauthorizedHandled = false
  }

  updateAccessTokenLocalStorage(accesstoken: string, expiresAt: number, refreshToken: string) {
    localStorage.setItem('accesstoken', accesstoken);
    localStorage.setItem('expiresAt', expiresAt.toString());
    localStorage.setItem('refresh_token', refreshToken);

  }

  setSession(accessToken: string, expiresAt: number, refreshToken: string) {
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('expires_at', expiresAt.toString());
    localStorage.setItem('refresh_token', refreshToken);

    const expiresIn = expiresAt * 1000 - Date.now(); // Convert to milliseconds
    this.startLogoutTimer(expiresIn);
  }
  
  startLogoutTimer(duration: number) {
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }
  
    this.logoutTimer = setTimeout(() => {
      this.refreshAccessToken().subscribe({
        next: () => {
          console.log('Access token refreshed. Logout timer restarted.');
        },
        error: () => {
          console.error('Failed to refresh access token. Logging out.');
          this.logout();
        }
      });
    }, duration - 3600000); // Refresh the token 1 hour before it expires
  }

  // checkAutoLogout() {
  //   const expiresAt = Number(localStorage.getItem('expires_at'));
  //   if (expiresAt && expiresAt * 1000 < Date.now()) {
  //     this.logout();
  //   }
  //   else {
  //     this.startLogoutTimer(expiresAt * 1000 - Date.now());
  //   }
  // }

  isLoggedIn(): boolean {
    const expiresAt = Number(localStorage.getItem('expires_at'));
    return expiresAt * 1000 > Date.now(); // Convert to milliseconds
  }

  isAuthenticated(): boolean {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.token) {
      const tokenExpiration = this.getTokenExpiration(user.token);
      return tokenExpiration > Date.now();
    }
    return false;
  }

  private getTokenExpiration(token: string): number {
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      return payload.exp * 1000; // Expiration time in milliseconds
    }
    return 0;
  }

  refreshAccessToken(): Observable<any> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      console.error('No refresh token found. User needs to log in again.');
      this.logout();
      return new Observable(); // Return an empty observable if no refresh token is found
    }
  
    const clientId = environment.stravaClientID; // Your Strava client ID
    const clientSecret = environment.stravaClientSecret; // Your Strava client secret
  
    return this.http.post('https://www.strava.com/oauth/token', {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).pipe(
      map((response: any) => {
        // Update local storage with the new tokens
        this.setSession(response.access_token, response.expires_at, response.refresh_token);
        console.log('Access token refreshed successfully.');
        return response;
      }),
      catchError((error) => {
        console.error('Failed to refresh access token:', error);
        this.logout(); // Log the user out if the refresh fails
        return throwError(error);
      })
    );
  }

  setUnauthorizedHandled(value: boolean) {
    this.isUnauthorizedHandled = value;
  }

  getUnauthorizedHandled(): boolean {
    return this.isUnauthorizedHandled;
  }
}
