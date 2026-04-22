import { RenderMode, ServerRoute } from '@angular/ssr';
import { authGuard } from './service/auth-gaurd-service';

export const serverRoutes: ServerRoute[] = [
   {
    path: 'reset-password/:resetToken',
    renderMode: RenderMode.Client

  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  },
    
];
