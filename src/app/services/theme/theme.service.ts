import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
    providedIn: 'root',
})
export class ThemeService {

    constructor(@Inject(DOCUMENT) private document: Document) {}

    switchTheme(theme: string) {
        let themeLink = this.document.getElementById('app-theme') as HTMLLinkElement;
        console.log("switchTheme gets triggered" + themeLink);
        if (themeLink) {
            console.log("themeLink: " + themeLink.href);
            themeLink.href = theme + '.css';
            console.log("The theme link " + themeLink.href + " : " + theme + '.css')
        }
    }
}