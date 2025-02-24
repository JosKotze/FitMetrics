import { Component, inject} from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme/theme.service';
import { Store } from '@ngrx/store';
import { logout } from '../../store/actions/session.actions';
import { AuthService } from '../../services/auth/auth.service';
import { selectProfileAvatar } from '../../store/selectors/auth.selector';
import { Observable, of } from 'rxjs';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  items: any[] = [];
  authService = inject(AuthService);
  checked: boolean = false;
  selectedTheme: string = 'dark';
  profileAvatar: Observable<string> = of(''); 

  constructor(private router: Router,
    private themeService: ThemeService, private store: Store) {}

  ngOnInit(): void {
    this.profileAvatar = this.store.select(selectProfileAvatar);
    this.themeService.setTheme(this.selectedTheme);
    
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/'
      },
      {
        label: 'Activities to Excel',
        icon: 'pi pi-fw pi-file-excel',
        routerLink: ''
      },
      {
        label: 'StravaAuthentication',
        icon: 'pi pi-fw pi-key',
        routerLink: '/stravaAuth'
      },
      {
        label: 'Map',
        icon: 'pi pi-map',
        routerLink: '/mapDetail'
      },
      {
        label: 'logout',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.logout()
      },
    ];
  }

  onThemeChange(theme: string): void {
    this.selectedTheme = theme;
    this.themeService.setTheme(theme);
  }

  // changeTheme(event: any) {
  //   console.log("changeTheme get triggered")
  //   //const newCheckedState = event.checked;
  //   //if (newCheckedState !== this.checked) {
  //     //this.checked = newCheckedState;
  //     if (this.checked) {
  //       this.themeService.switchTheme('saga-blue');
  //     } else {
  //       this.themeService.switchTheme('vela-blue');
  //     }
  //   //}
  // }

  logout() {
    // Perform any logout logic (e.g., clearing user session, etc.)
    // Then navigate to the login page

    this.store.dispatch(logout());
    this.authService.logout();

    this.router.navigate(['/login']);
  }
  
}
