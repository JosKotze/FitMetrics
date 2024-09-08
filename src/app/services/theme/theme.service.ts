import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {
    activeTheme: string = 'dark';

    constructor(@Inject(DOCUMENT) private document: Document) {}
  
    switchTheme(theme: string) {
        let themeLink = document.getElementById('app-theme') as HTMLLinkElement;
        console.log("switchTheme gets triggered" + themeLink);
        if (themeLink) {
          console.log("themeLink: " + themeLink);
          themeLink.href = theme + '.css';
          console.log(themeLink.href = theme + '.css')
          console.log("Theme link updated:", themeLink);
        }
      }

  setTheme(theme: string): void {
    let themeLink = document.getElementById('app-theme') as HTMLLinkElement;

    if(themeLink){
      themeLink.href = theme + '.css';
    }
    this.activeTheme = theme;
  }
  
  getTheme() {
    return this.activeTheme;
  }
}