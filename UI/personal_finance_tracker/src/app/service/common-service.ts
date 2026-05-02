import { isPlatformBrowser } from '@angular/common';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  public themeMode = signal<'light' | 'dark'>('light');
  readonly currentTheme = this.themeMode.asReadonly();

   private platformId = inject(PLATFORM_ID);

  public toggleTheme(theme: 'light' | 'dark') {
    this.themeMode.set(theme);
       if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
  }

  public clearSessionData(){
    this.clearLocalStorage();
    this.clearSessionStorage();
    this.clearCookies();
  }

  public clearLocalStorage() {
     if (isPlatformBrowser(this.platformId)) {
        localStorage.clear();
     }
  }

  public clearSessionStorage() {
     if (isPlatformBrowser(this.platformId)) {
    sessionStorage.clear();
     }
  }

  public clearCookies() {
     if (isPlatformBrowser(this.platformId)) {
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    }
  }
  }
}
