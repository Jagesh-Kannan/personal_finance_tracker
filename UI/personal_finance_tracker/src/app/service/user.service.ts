import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private baseApiUrl = environment.expenseApiUrl;
  private signupEndpoint = environment.registrationEndpoint;

  constructor(private _http: HttpClient) { }

  public register(data: RegisterDetails) {
    return this._http.post(`${this.baseApiUrl}${this.signupEndpoint}`, data);
  }
}
