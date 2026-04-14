import { Injectable, signal } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseApiUrl = environment.expenseApiUrl;
  private signupEndpoint = environment.registrationEndpoint;
  private forgotPasswordEndpoint = environment.forgotPassowrdEndpoint;
  private resetPasswordEndpoint = environment.resetPasswordEndpoint;

  public registerLoader = signal<boolean>(false)
  public forgotPasswordLoader = signal<boolean>(false)
  public resetPasswordLoader = signal<boolean>(false)

  constructor(private _http: HttpClient) { }

  public register(data: RegisterDetails) {
    this.registerLoader.set(true)
    return this._http.post(`${this.baseApiUrl}${this.signupEndpoint}`, data).pipe(
            finalize(() => {
              this.registerLoader.set(false);
            })
          );
  }

  public forgotPassword(data: { email: string }) {
    this.forgotPasswordLoader.set(true)
    return this._http.post(`${this.baseApiUrl}${this.forgotPasswordEndpoint}`, data).pipe(
            finalize(() => {
              this.forgotPasswordLoader.set(false);
            })
          );
  }

  public resetPassword(token: string, data: ResetPasswordDetails) {
    this.resetPasswordLoader.set(true);
    return this._http.post(`${this.baseApiUrl}${this.resetPasswordEndpoint}${token}`, data).pipe(
            finalize(() => {
              this.resetPasswordLoader.set(false);
            })
          );
  }
}
