import { Component} from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme/theme.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  items: any[] = [];

  checked = false;

  constructor(private router: Router,
    private themeService: ThemeService) {}

  ngOnInit(): void {
    this.items = [
      {
        label: 'Home',
        icon: 'pi pi-fw pi-home',
        routerLink: '/'
      },
      {
        label: 'Activities Data',
        icon: 'pi pi-fw pi-cog',
        routerLink: '/invalidTest'
      },
      {
        label: 'Activities to Excel',
        icon: 'pi pi-fw pi-envelope',
        routerLink: ''
      },
      {
        label: 'StravaAuthentication',
        icon: 'pi pi-fw pi-key',
        routerLink: '/stravaAuth'
      },
      {
        label: 'logout',
        icon: 'pi pi-fw pi-spin pi-power-off',
        routerLink: '/login'
      },
    ];
  }

  changeTheme(theme: boolean) {
    console.log("changeTheme get triggered")
    if(theme){
      //let aTheme:string = "saga-blue";
      this.themeService.switchTheme("saga-blue");
      console.log("true")
      console.log("The theme:" + this.themeService.switchTheme("saga-blue"))
    }
    else {
      //let aTheme:string = "vela-blue";
      this.themeService.switchTheme("vela-blue");
      console.log("false")
      console.log("The theme:" + this.themeService.switchTheme("vela-blue"))
    }
  }

  logout() {
    // Perform any logout logic (e.g., clearing user session, etc.)
    // Then navigate to the login page
    console.log("logout gets triggered")
    this.router.navigate(['']);
  }
  
}
