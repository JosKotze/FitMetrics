import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppLayoutComponent } from './app.layout.component';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { ButtonModule } from 'primeng/button';
import { AppLayoutRoutingModule } from './layout.routing.module';

import { MenubarModule } from 'primeng/menubar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SidebarModule } from 'primeng/sidebar';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppLayoutComponent,
    NavbarComponent,
    AppLayoutComponent,
    NavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ButtonModule,
    CommonModule,
    AppLayoutRoutingModule,
    MenubarModule,
    InputSwitchModule,
    SidebarModule,
    FormsModule
  ],
  exports: [
    AppLayoutComponent
  ]
})
export class AppLayoutModule {}
