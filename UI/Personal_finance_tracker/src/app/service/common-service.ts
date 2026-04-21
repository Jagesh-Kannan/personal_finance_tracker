import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommonService {

  private themeMode = signal<'light' | 'dark'>('light');
  readonly currentTheme = this.themeMode.asReadonly();

  public toggleTheme(theme: 'light' | 'dark') {
    this.themeMode.set(theme);
       if (theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
  }
}
