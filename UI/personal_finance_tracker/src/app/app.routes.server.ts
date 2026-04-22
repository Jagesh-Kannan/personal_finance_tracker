import { RenderMode, ServerRoute } from '@angular/ssr';
import { authGuard } from './service/auth-gaurd-service';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
     {
    path: 'reset-password/:resetToken',
    renderMode: RenderMode.Server 
  },
];
