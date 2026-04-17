import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import('./pages/login/login').then(m => m.Login),
    },
    {
        path: "reset-password/:resetToken",
        loadComponent: () => import('./pages/password-reset/password-reset').then(m => m.PasswordReset),
    },
    {
        path: "landing",
        loadComponent: () => import('./pages/landing/landing').then(m => m.Landing),
    }
];
