import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../service/auth.service';
import { environment } from '../environment';

export const credentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  // 1. Initial Request Setup
  let authReq = req.clone({ withCredentials: true });
  const accessToken = localStorage.getItem('access_token');

  // Attach token if it exists and we aren't on auth routes
  if (accessToken && !req.url.includes(environment.login_path) && !req.url.includes('/refresh-token')) {
    authReq = authReq.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 2. Check for 401 and ensure we aren't already trying to refresh
      if (error.status === 401 && !req.url.includes('/refresh-token') && !req.url.includes(environment.login_path)) {
        
        return authService.getAccessTokenByRefreshToken().pipe(
          switchMap((response: any) => {
            // 3. Refresh worked! Store new token (if not already handled in service)
            const newToken = response.data.accessToken;
            const newRefToken = response.data.refreshToken;
            localStorage.setItem('access_token', newToken);
            localStorage.setItem('refresh_token', newRefToken);

            // 4. Clone the ORIGINAL request with the NEW token and retry
            const retryReq = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` },
              withCredentials: true
            });
            
            return next(retryReq);
          }),
          catchError((refreshError) => {
            // 5. Refresh failed (Refresh Token expired) -> Logout user
            // authService.logout(); // Clear local storage/cookies
            router.navigate([environment.login_path]);
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};