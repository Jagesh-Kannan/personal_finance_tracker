import {
  ApplicationConfig,
  LOCALE_ID,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LucideFileText, LucideImport, LucidePlus, provideLucideIcons } from '@lucide/angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { credentialsInterceptor } from './interseptor/http-interseptor.service';
import { provideStore } from '@ngrx/store';
import { expenseReducer } from './stateManagement/reducer/expense.reducer';
import { userReducer } from './stateManagement/reducer/user.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideLucideIcons(LucideFileText, LucideImport, LucidePlus),
    provideHttpClient(withInterceptors([credentialsInterceptor])),
    provideStore({expenses:expenseReducer, user:userReducer}),
     { provide: LOCALE_ID, useValue: 'en-IN' }
  ],
};
