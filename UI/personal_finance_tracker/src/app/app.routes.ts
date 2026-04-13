import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: "login",
        loadComponent: () => import('./login/login').then(m => m.Login),
    },
    {
        path: "landing",
        loadComponent: () => import('./components/landing/landing').then(m => m.Landing),
    }
];
