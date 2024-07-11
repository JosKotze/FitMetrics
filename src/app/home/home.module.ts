import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing.module';
import { AppLayoutModule } from '../layout/app.layout.module';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    AppLayoutModule,
    ChartModule,
    TableModule,
    HttpClientModule
  ]
})
export class HomeModule {}
