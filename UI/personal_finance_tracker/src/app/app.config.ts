import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LucideFileText, provideLucideIcons } from '@lucide/angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interseptor/http-interseptor.service';

export const appConfig: ApplicationConfig = {
  
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes), 
    // provideClientHydration(withEventReplay()),
    provideLucideIcons(LucideFileText),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
  ],
};
