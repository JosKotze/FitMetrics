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

    constructor(private router: Router) { }

  ngOnInit(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const hideNavbarRoutes = ['/signup', '/login'];
      this.showNavbar = !hideNavbarRoutes.includes(this.router.url);
    });

    this.checkAccessToken();
  }

  checkAccessToken(): void {
    //var existingEntries = JSON.parse(localStorage.getItem("store_owner_ad_contacts"));
    const accessToken = JSON.parse(localStorage.getItem("accesstoken")!);
    //let accessToken = localStorage.getItem('accesstoken');

    if (accessToken !== null) {
      console.log('AccessToken exists:', accessToken);
    } else {
      console.log('AccessToken does not exist');
    }

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let value = localStorage.getItem(key!);
      console.log(`${key}: ${value}`);
    }
  }
}
