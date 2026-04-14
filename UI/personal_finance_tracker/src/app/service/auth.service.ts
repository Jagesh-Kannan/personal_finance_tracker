import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environment';
import { finalize, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private baseApiUrl = environment.expenseApiUrl;
  private loginEndpoint = environment.loginEndpoint;
  public loginLoader = signal<boolean>(false);
  constructor(private http: HttpClient ) { }


  public login(data: LoginDetails):Observable<any> {
      this.loginLoader.set(true);
      return this.http.post(`${this.baseApiUrl}${this.loginEndpoint}`, data).pipe(
        finalize(() => {
          this.loginLoader.set(false);
        })
      );
  }
}
