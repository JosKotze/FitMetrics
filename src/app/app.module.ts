import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelModule } from 'primeng/panel';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { NavbarComponent } from './components/navbar/navbar.component';
import { MenubarModule } from 'primeng/menubar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { StravaAuthComponent } from './components/strava-auth/strava-auth.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { authReducer } from './store/reducers/auth.reducer';
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { FitMetricsApi } from './api/FitMetricsApi';
import { provideRouter } from '@angular/router';
import { appReducers } from './store/app.state';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    NavbarComponent,
    StravaAuthComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    PanelModule,
    ButtonModule,
    DividerModule,
    MenubarModule,
    InputSwitchModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({ maxAge: 5}),
    HttpClientModule
  ],
  providers: [
    //provideClientHydration(),
    //FitMetricsApi,
    //provideHttpClient(withFetch()) // Enabling fetch API 
    provideClientHydration(), 
    provideHttpClient(withFetch())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
