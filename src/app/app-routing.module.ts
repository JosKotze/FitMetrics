import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./layout/app.layout.module').then(m => m.AppLayoutModule)
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  //{ path: 'home', component: HomeComponent},
  //{ path: '', redirectTo: '/login', pathMatch: 'full' } 

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {


 }
