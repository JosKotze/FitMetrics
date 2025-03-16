import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { StravaAuthComponent } from './components/strava-auth/strava-auth.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { AuthGuard } from './guards/auth.guard';
import { MapDetailComponent } from './components/map-detail/map-detail.component';


const routes: Routes = [
  { path: 'signup', component: SignupComponent },
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] }, 
  { path: 'stravaAuth', component: StravaAuthComponent, canActivate: [AuthGuard] },
  { path: 'map-detail/:userId/:activityId', component: MapDetailComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '', canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
