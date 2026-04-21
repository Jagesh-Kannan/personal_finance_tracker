import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environment';
import { catchError, finalize, Observable } from 'rxjs';
import { AuthErrorBannerService } from './auth-error-banner.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseApiUrl = environment.expenseApiUrl;
  private loginEndpoint = environment.loginEndpoint;
  public loginLoader = signal<boolean>(false);
  constructor(private http: HttpClient, private authErrorBanner: AuthErrorBannerService ) { }


  public login(data: LoginDetails):Observable<any> {
      this.loginLoader.set(true);
      return this.http.post(`${this.baseApiUrl}${this.loginEndpoint}`, data, {
    withCredentials: true // CRITICAL: This allows the browser to receive and send cookies
  }).pipe(
        catchError((error) => {
          const errorMessage = error.error?.message || 'An error occurred during login. Please try again.';
          this.authErrorBanner.showError(errorMessage);
          throw error;
        }),
        finalize(() => {
          this.loginLoader.set(false);
        })
      );
  }
}
