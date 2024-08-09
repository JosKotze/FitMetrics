import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from './store/app.state';
import { selectAccessToken, selectAuthCode } from './store/selectors/auth.selector';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'FitMetrics';

  // authCode$ = this.store.select(selectAuthCode);

  // constructor(private store: Store<AppState>) {}

  // ngOnInit() {
  //   this.authCode$.subscribe(code => {
  //     console.log('Auth Code:', code);
  //   });

  //   this.accessToken$.subscribe(accessToken => {
  //     console.log('Access Token 123:', accessToken);
  //   });
  // }
}
