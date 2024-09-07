import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PanelModule } from 'primeng/panel';
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
import { HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommonModule } from '@angular/common';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { appReducers } from './store/app.state';
import { metaReducers } from './store/metaReducers/localStorageSyncReducer';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    StravaAuthComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    PanelModule,
    ButtonModule,
    DividerModule,
    MenubarModule,
    InputSwitchModule,
    ReactiveFormsModule,
    FormsModule,
    StoreModule.forRoot(appReducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 5}),
    HttpClientModule,
    CommonModule,
    BrowserModule,
    ToastModule
  ],
  providers: [
    //provideClientHydration(),
    //FitMetricsApi,
    //provideHttpClient(withFetch()) // Enabling fetch API 
    provideClientHydration(), 
    provideHttpClient(withFetch()),
    MessageService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
