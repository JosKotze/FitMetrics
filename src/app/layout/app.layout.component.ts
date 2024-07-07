import { Component } from '@angular/core';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  templateUrl: './app.layout.component.html',
  //imports: [MenubarModule, ButtonModule, InputSwitchModule, FormsModule],
  styleUrls: [] // Add CSS file if needed
})
export class AppLayoutComponent {}
