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
                path:'',
                redirectTo: 'overview',
                pathMatch:'full'
            },
            {
                path: "me",
                canActivate: [authGuard],
                loadComponent: () => import('./pages/user-info/user-info').then(m => m.UserInfo),
            },
            {
                path: "overview",
                canActivate: [authGuard],
                loadComponent: () => import('./pages/overview/overview').then(m => m.Overview),
            },
            {
                path: "import",
                canActivate: [authGuard],
                loadComponent: () => import('./pages/add-expenses/add-expenses').then(m => m.AddExpenses),
            },
            {
                path: "transaction-history",
                canActivate: [authGuard],
                loadComponent: () => import('./pages/transaction-history/transaction-history').then(m => m.TransactionHistory),
            },
        ]
    },
];
