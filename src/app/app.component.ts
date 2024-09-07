import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { selectAccessToken, selectAuthCode } from './store/selectors/auth.selector';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FitMetrics';
  showNavbar: boolean = true;

  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const hideNavbarRoutes = ['/signup', '/login'];
      this.showNavbar = !hideNavbarRoutes.includes(this.router.url);
    });
  }
}
