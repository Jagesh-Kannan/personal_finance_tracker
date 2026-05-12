import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environment';
import { catchError, finalize, tap } from 'rxjs';
import { StateDispatch } from './state-dispatch';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseApiUrl = environment.expenseApiUrl;

  private getAllExpenseEndpoint = environment.getAllExpenseEndpoint;
  private importExpenseEndpoint = environment.importExpenseEndpoint;
  private createExpenseEndpoint = environment.createExpenseEndpoint;

  public getExpenseLoader = signal<boolean>(false);
  public fileExtractionLoader = signal<boolean>(false);
  public fileExtractionSuccess = signal<boolean>(false);
  public createExpenseLoader = signal<boolean>(false);

  constructor(private http: HttpClient,private stateDispatchService:StateDispatch) {}

  public getAllExpense() {
    this.getExpenseLoader.set(true);
    return this.http.get(`${this.baseApiUrl}${this.getAllExpenseEndpoint}`).pipe(
      tap( (res:any)=> {
          if (res && res.data) {
      this.stateDispatchService.storeExpense(res.data);
    }
      }),
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

  public createExpense(expenseData: CreateExpenseBody | CreateExpenseBody[]) {
    this.createExpenseLoader.set(true);
    return this.http.post(`${this.baseApiUrl}${this.createExpenseEndpoint}`, expenseData).pipe(
      catchError((error) => {
        const errorMessage =
          error.error?.message || 'An error occurred while creating the expense. Please try again.';
        // this.authErrorBanner.showError(errorMessage);
        throw error;
      }),
      finalize(() => {
        this.createExpenseLoader.set(false);
      }),
    );
  }

  public uploadExpenseFile(file: File) {
    this.fileExtractionSuccess.set(false);

    const formData = new FormData();
    formData.append('statementFile', file);

    return this.http
      .post(`${this.baseApiUrl}${this.importExpenseEndpoint}`, formData, {
        reportProgress: true, // Required to track progress
        observe: 'events', // Required to see HttpEventType updates
      })
      .pipe(
        tap((event: HttpEvent<any>) => {
          // Once the event type is 'Response', the upload is 100% successful
          if (event.type === HttpEventType.UploadProgress) {
            if (event.loaded === event.total) {
              this.fileExtractionLoader.set(true); // Start extraction loader
            }
          }
          if (event.type === HttpEventType.Response) {
            this.fileExtractionSuccess.set(true); // Mark extraction as successful
          }
        }),
        catchError((error) => {
          const errorMessage =
            error.error?.message || 'An error occurred during file upload. Please try again.';
          throw error;
        }),
        finalize(() => {
          this.fileExtractionLoader.set(false);
        }),
      );
  }
}
