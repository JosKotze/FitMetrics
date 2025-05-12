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
import { HTTP_INTERCEPTORS, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { CommonModule } from '@angular/common';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { HomeComponent } from './home/home.component';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { appReducers } from './store/app.state';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ChartModule } from 'primeng/chart';
import { AccordionModule } from 'primeng/accordion';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { MapDetailComponent } from './components/map-detail/map-detail.component';
import { AuthInterceptor } from './services/auth/auth.interceptor';
import { BubblesComponent } from './bubbles/bubbles.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    StravaAuthComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    DashboardComponent,
    MapDetailComponent,
    BubblesComponent
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
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument({ maxAge: 5}),
    HttpClientModule,
    CommonModule,
    BrowserModule,
    ToastModule,
    ChartModule,
    AccordionModule,
    AvatarModule,
    CardModule,
    InputTextModule,
    PaginatorModule,
    ProgressSpinnerModule,
    TableModule,
  ],
  providers: [
    provideClientHydration(), 
    provideHttpClient(withFetch()),
    MessageService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
