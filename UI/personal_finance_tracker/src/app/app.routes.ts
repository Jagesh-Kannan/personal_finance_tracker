import { Routes } from '@angular/router';
import { authGuard } from './service/auth-gaurd-service';

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
        canActivate: [authGuard],
        loadComponent: () => import('./pages/landing/landing').then(m => m.Landing),
    },
    {
        path: "home",
        canActivate: [authGuard],
        loadComponent: () => import('./pages/home/home').then(m => m.Home),
        children: [
            {
                path: "me",
                canActivate: [authGuard],
                loadComponent: () => import('./pages/user-info/user-info').then(m => m.UserInfo),
            },
        ]
    },
];
