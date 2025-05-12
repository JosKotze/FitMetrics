import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { selectAccessToken, selectAuthCode } from './store/selectors/auth.selector';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ActivityService } from './services/activity/activity.service';
import { AuthService } from './services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FitMetrics';
  showNavbar: boolean = true;
  activityService = inject(ActivityService);
  authService = inject(AuthService);

    constructor(private router: Router) { }

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const hideNavbarRoutes = ['/signup', '/login'];
      this.showNavbar = !hideNavbarRoutes.includes(this.router.url);
    });
  }

  // checkAccessToken(): void {
  //   if(typeof window !== 'undefined' && window.localStorage){
  //     const accessToken = JSON.parse(localStorage.getItem("accesstoken")!);

  //     if (accessToken !== null) {
  //       this.syncActivities(accessToken);
  //     } else {
  //       console.log('AccessToken does not exist');
  //     }

  //     // for (let i = 0; i < localStorage.length; i++) {
  //     //   let key = localStorage.key(i);
  //     //   let value = localStorage.getItem(key!);
  //     //   console.log(`${key}: ${value}`);
  //     // }
  //   }
  // }

  // syncActivities(accessToken: string): void {
  //   this.activityService.syncActivities(accessToken)
  //     .subscribe({
  //       next: (response) => {
  //         console.log('Sync successful:', response);
  //       },
  //       error: (error) => {
  //         console.error('Sync failed:', error);
  //       }
  //     });
  // }
}
