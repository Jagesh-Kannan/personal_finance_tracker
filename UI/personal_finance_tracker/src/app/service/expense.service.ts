import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environment';
import { catchError, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseApiUrl = environment.expenseApiUrl;

  private getAllExpenseEndpoint = environment.getAllExpenseEndpoint;
  public getExpenseLoader = signal<boolean>(false);

  constructor(private http: HttpClient) {}

  public getAllExpense() {
    this.getExpenseLoader.set(true);
    return this.http.get(`${this.baseApiUrl}${this.getAllExpenseEndpoint}`).pipe(
      catchError((error) => {
        const errorMessage =
          error.error?.message || 'An error occurred during login. Please try again.';
        // this.authErrorBanner.showError(errorMessage);
        throw error;
      }),
      finalize(() => {
        this.getExpenseLoader.set(false);
      }),
    );
  }
}
