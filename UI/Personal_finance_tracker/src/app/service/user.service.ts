import { Injectable, signal } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, Observable, tap } from 'rxjs';
import { AuthErrorBannerService } from './auth-error-banner.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseApiUrl = environment.expenseApiUrl;
  private signupEndpoint = environment.registrationEndpoint;
  private forgotPasswordEndpoint = environment.forgotPassowrdEndpoint;
  private resetPasswordEndpoint = environment.resetPasswordEndpoint;
  private userInfoEndpoint = environment.userInfoEndpoint;

  public registerLoader = signal<boolean>(false);
  public forgotPasswordLoader = signal<boolean>(false);
  public resetPasswordLoader = signal<boolean>(false);
  public userInfoLoader = signal<boolean>(false);

  constructor(private _http: HttpClient, private authErrorBanner: AuthErrorBannerService) { }

  public register(data: RegisterDetails) {
    this.registerLoader.set(true)
    return this._http.post(`${this.baseApiUrl}${this.signupEndpoint}`, data).pipe(
        catchError((error) => {
                const errorMessage = error.error?.message || 'An error occurred during registration. Please try again.';
                this.authErrorBanner.showError(errorMessage);
                throw error;
              }),
            finalize(() => {
              this.registerLoader.set(false);
            })
          );
  }

  public forgotPassword(data: { email: string }) {
    this.forgotPasswordLoader.set(true)
    return this._http.post(`${this.baseApiUrl}${this.forgotPasswordEndpoint}`, data).pipe(
      tap((response: any) => {
        if (response && response.status === 'success') {
          this.authErrorBanner.showSuccess(response.message);
        }
      }),
        catchError((error) => {
                const errorMessage = error.error?.message || 'An error occurred during forgot password request. Please try again.';
                this.authErrorBanner.showError(errorMessage);
                throw error;
              }),
            finalize(() => {
              this.forgotPasswordLoader.set(false);
            })
          );
  }

  public resetPassword(token: string, data: ResetPasswordDetails) {
    this.resetPasswordLoader.set(true);
    return this._http.post(`${this.baseApiUrl}${this.resetPasswordEndpoint}${token}`, data).pipe(
        catchError((error) => {
                const errorMessage = error.error?.message || 'An error occurred during password reset. Please try again.';
                this.authErrorBanner.showError(errorMessage);
                throw error;
              }),
            finalize(() => {
              this.resetPasswordLoader.set(false);
            })
          );
  }

  public getUserInfo() : Observable<any> {
    this.userInfoLoader.set(true);
    return this._http.get(`${this.baseApiUrl}${this.userInfoEndpoint}`).pipe(
        catchError((error) => {
                const errorMessage = error.error?.message || 'An error occurred while fetching user info. Please try again.';
                this.authErrorBanner.showError(errorMessage);
                throw error;
              }),
            finalize(() => {
              this.userInfoLoader.set(false);
            })
          );
  }
}
