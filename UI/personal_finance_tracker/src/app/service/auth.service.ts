import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseApiUrl = environment.expenseApiUrl;
  private loginEndpoint = environment.loginEndpoint;
  constructor(private http: HttpClient ) { }


  public login(data: LoginDetails):Observable<any> {
      return this.http.post(`${this.baseApiUrl}${this.loginEndpoint}`, data);
  }
}
