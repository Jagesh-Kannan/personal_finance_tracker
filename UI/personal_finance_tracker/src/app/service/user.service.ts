import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseApiUrl = environment.expenseApiUrl;
  private signupEndpoint = environment.registrationEndpoint;
  private forgotPasswordEndpoint = environment.forgotPassowrdEndpoint;
  private resetPasswordEndpoint = environment.resetPasswordEndpoint;

  constructor(private _http: HttpClient) { }

  public register(data: RegisterDetails) {
    return this._http.post(`${this.baseApiUrl}${this.signupEndpoint}`, data);
  }

  public forgotPassword(data: { email: string }) {
    return this._http.post(`${this.baseApiUrl}${this.forgotPasswordEndpoint}`, data);
  }

  public resetPassword(token: string, data: ResetPasswordDetails) {
    return this._http.post(`${this.baseApiUrl}${this.resetPasswordEndpoint}${token}`, data);
  }
}
