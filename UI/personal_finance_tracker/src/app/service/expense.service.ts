import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { environment } from '../environment';
import { catchError, finalize, tap } from 'rxjs';
import { StateDispatch } from './state-dispatch';
import { ToasterService } from './toaster.service';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private baseApiUrl = environment.expenseApiUrl;

  private getAllExpenseEndpoint = environment.getAllExpenseEndpoint;
  private importExpenseEndpoint = environment.importExpenseEndpoint;
  private createExpenseEndpoint = environment.createExpenseEndpoint;
  private updateExpenseEndpoint = environment.updateExpenseEndpoint;
  private deleteExpenseEndpoint = environment.deleteExpenseEndpoint;
  private deleteAllExpensesEndpoint = environment.deleteAllExpensesEndpoint;

  public getExpenseLoader = signal<boolean>(false);
  public fileExtractionLoader = signal<boolean>(false);
  public fileExtractionSuccess = signal<boolean | null>(null);
  public createExpenseLoader = signal<boolean>(false);
  public updateExpenseLoader = signal<boolean>(false);
  public deleteExpenseLoader = signal<boolean>(false);  

  constructor(private http: HttpClient,private stateDispatchService:StateDispatch, private toasterService: ToasterService) {}

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
         this.toasterService.showError(errorMessage);
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
      tap((res:any)=>{
        this.toasterService.showSuccess('Expense(s) added successfully!');
      }),
      catchError((error) => {
        const errorMessage =
          error.error?.message || 'An error occurred while creating the expense. Please try again.';
         this.toasterService.showError(errorMessage);
        throw error;
      }),
      finalize(() => {
        this.createExpenseLoader.set(false);
      }),
    );
  }

  public updateExpense(expense:ExpenseSchema){
   this.updateExpenseLoader.set(true);
    return this.http.put(`${this.baseApiUrl}${this.updateExpenseEndpoint}`, expense).pipe(
      tap((res:any)=>{
        this.toasterService.showSuccess('Expense updated successfully!');
      }),
      catchError((error) => {
        const errorMessage =
          error.error?.message || 'An error occurred while updating the expense. Please try again.';
        this.toasterService.showError(errorMessage);
        throw error;
      }),
      finalize(() => {
        this.updateExpenseLoader.set(false);
      }),
    );
  };

  public deleteExpenses(expenseIds: string[]) {
    this.deleteExpenseLoader.set(true);
    return this.http.post(`${this.baseApiUrl}${this.deleteExpenseEndpoint}`,  expenseIds ).pipe(
      tap((res:any)=>{
        this.toasterService.showSuccess('Expense(s) deleted successfully!');
      }),
      catchError((error) => {
        const errorMessage =
          error.error?.message || 'An error occurred while deleting the expense. Please try again.';
        this.toasterService.showError(errorMessage);
        throw error;
      }),
      finalize(() => {
        this.deleteExpenseLoader.set(false);
      }),
    );
  };

  public deleteAllExpenses(){
     this.deleteExpenseLoader.set(true);
    return this.http.delete(`${this.baseApiUrl}${this.deleteAllExpensesEndpoint}` ).pipe(
      tap((res:any)=>{
        this.toasterService.showSuccess(res.message || 'Expense(s) deleted successfully!');
      }),
      catchError((error) => {
        const errorMessage =
          error.error?.message || 'An error occurred while deleting the expense. Please try again.';
        this.toasterService.showError(errorMessage);
        throw error;
      }),
      finalize(() => {
        this.deleteExpenseLoader.set(false);
      }),
    );
  }

  public uploadExpenseFile(file: File) {
    this.fileExtractionSuccess.set(null);

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
          this.fileExtractionSuccess.set(false); // Mark extraction as failed
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
