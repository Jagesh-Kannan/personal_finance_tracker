import { RenderMode, ServerRoute } from '@angular/ssr';
import { authGuard } from './service/auth-gaurd-service';

export const serverRoutes: ServerRoute[] = [

     {
        path: "login",
       renderMode: RenderMode.Prerender
    },
  {
  path: 'reset-password/:resetToken',
  renderMode: RenderMode.Server 
},
  {
    path: '**',
    renderMode: RenderMode.Server
  },
  //    {
  //   path: 'reset-password/:resetToken',
  //   renderMode: RenderMode.Prerender,
  //   getPrerenderParams: async () => {
  //     // Typically you'd fetch IDs from an API here
  //     // For a reset token, this is rarely practical
  //     return [
  //       { resetToken: 'example-token-1' },
  //       { resetToken: 'example-token-2' }
  //     ];
  //   }
  // }
];
