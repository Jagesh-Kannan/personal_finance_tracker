import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../environment';
import { catchError, finalize, Observable, tap } from 'rxjs';
import { AuthErrorBannerService } from './auth-error-banner.service';
import { Router } from '@angular/router';
import { CommonService } from './common-service';


@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseApiUrl = environment.expenseApiUrl;
  private loginEndpoint = environment.loginEndpoint;
  public loginLoader = signal<boolean>(false);

  private refreshTokenEndpoint = environment.refreshTokenEndpoint;

  private logoutEndpoint = environment.logoutEndpoint;
  public logoutLoader = signal<boolean>(false);




  constructor(private http: HttpClient, private authErrorBanner: AuthErrorBannerService, private router:Router, private commonService:CommonService ) { }


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

  public getAccessTokenByRefreshToken():Observable<any>{
    const refreshToken = localStorage.getItem('refresh_token');
    return this.http.post(`${this.baseApiUrl}${this.refreshTokenEndpoint}`,{refreshToken}).pipe(
        catchError((error) => {
          const errorMessage = error.error?.message || 'An error occurred during login. Please try again.';
          this.authErrorBanner.showError(errorMessage);
          if(error.status === 401){
            this.router.navigate([environment.login_path]);
          }
          throw error;
        }),
        finalize(() => {
          this.loginLoader.set(false);
        })
      );
  }

  public logout(){
     this.logoutLoader.set(true);
      return this.http.get(`${this.baseApiUrl}${this.logoutEndpoint}`).pipe(
        tap((res:any)=>{
          if(res.status === 'success'){
            this.commonService.clearSessionData();
            this.router.navigate([environment.login_path]);
          }
        }),
        catchError((error) => {
          const errorMessage = error.error?.message || 'An error occurred during logout. Please try again.';
          this.authErrorBanner.showError(errorMessage);
          throw error;
        }),
        finalize(() => {
          this.logoutLoader.set(false);
        })
      );
  }
}
