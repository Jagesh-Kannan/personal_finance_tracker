import { Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { ExpenseService } from '../../service/expense.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { LucidIconModule } from '../../components/lucidIcon/lucid-icon/lucid-icon-module';
import { LucideImport, LucidePlus } from '@lucide/angular';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonLoader } from '../../components/loader/loader';
import { lastValueFrom } from 'rxjs';
import { AuthNotifyBannerComponent } from '../../components/notify-banner/auth-notify-banner.component';
import { Router } from '@angular/router';
import { SlideUpForm } from '../../components/slide-up-form/slide-up-form';
import { ExpenseListContainer } from '../../components/expense-list/expense-list-container/expense-list-container';
import { ExpenseListCard } from '../../components/expense-list/expense-list-card/expense-list-card';

@Component({
  selector: 'app-add-expenses',
  imports: [CommonModule, LucidIconModule, LucideImport, LucidePlus, 
    FormsModule, ReactiveFormsModule, ButtonLoader, ExpenseListContainer, ExpenseListCard,
    AuthNotifyBannerComponent, SlideUpForm],
  providers: [CurrencyPipe],
  templateUrl: './add-expenses.html',
  styleUrl: './add-expenses.css',
})
export class AddExpenses {
  // Signals for state management
  isDragging = signal(false);
  selectedFile = signal<File | null>(null);
  
  // ViewChild for the hidden input
  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  private edit_expenseData = signal<ExtractedExpenseData | null>(null);

  public fileUploadProgress = signal<number>(0);
  public openExpenseForm = signal<boolean>(false);
  protected readonly fileExtractionLoader;
  protected readonly fileExtractionSuccess;
  protected readonly createExpenseLoader;

  public expenseForm!:FormGroup 

  public extractedData = signal<ExtractedExpenseData[]>([]);


  constructor(private expenseService: ExpenseService, private _fb:FormBuilder,
    private router:Router
  ) {
    this.fileExtractionLoader = computed(() => this.expenseService.fileExtractionLoader());
    this.fileExtractionSuccess = computed(() => this.expenseService.fileExtractionSuccess());
    this.createExpenseLoader = computed(() => this.expenseService.createExpenseLoader());
    this.generateExpenseForm();
  }

  // Drag & Drop Handlers
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave() {
    this.isDragging.set(false);
  }

  onFileDropped(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileValidation(files[0]);
    }
  }

  // Input Selection Handler
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFileValidation(input.files[0]);
    }
  }

  // Generic File Validation
  private handleFileValidation(file: File) {
    const allowedTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'text/csv'
    ];

    if (allowedTypes.includes(file.type) || file.name.endsWith('.xls')) {
      this.selectedFile.set(file);
      this.uploadFile();
    } else {
      // You can trigger your Generic Dialog Service here for an error!
      alert('Invalid file type. Please upload PDF or Excel.');
    }
  }

clearFile() {
  this.selectedFile.set(null);
  this.fileUploadProgress.set(0); // Important: Reset progress
  if (this.fileInput()) {
    this.fileInput()!.nativeElement.value = '';
  }
}

  uploadFile() {
    const file = this.selectedFile();
    if (!file) return;

    // Logic for API call would go here
    this.expenseService.uploadExpenseFile(file).subscribe({
      next: (event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const progress = Math.round((100 * event.loaded) / (event.total || 1));
            this.fileUploadProgress.set(progress);
          } else if (event.type === HttpEventType.Response) {
            this.fileUploadProgress.set(100);
            this.extractedData.update( data => [...data, ...(event.body.data || [])] ); 
          }
        },
      error: (err) => {
        console.error('File upload error:', err);
        alert(err.error.details || 'Failed to upload file. Please try again.');
      }
    });
  }

  private generateExpenseForm(){

    this.expenseForm = this._fb.group({
        expenseName: ['', Validators.required],
        expenseCategory: ['', Validators.required],
        amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
        paymentMode: ['', Validators.required],
        mode: ['DEBITED', Validators.required],
        senderOrReceiver:[''],
        expenseDate: ['', Validators.required],
        notes: [''],
        currency: ['INR', Validators.required],
        customGrouping: ['']
    });
  }
  private resetExpenseForm(){
    this.expenseForm.reset({
      expenseName: '',
      expenseCategory: '',
      amount: '',
      paymentMode: '',
      mode: 'DEBITED',
      senderOrReceiver:'',
      expenseDate: '',
      notes: '',
      currency: 'INR',
      customGrouping: ''
    });
  }

  editExpense(expense:ExtractedExpenseData){

    this.edit_expenseData.set(expense);

    this.expenseForm.patchValue({
      expenseName: expense.expenseName,
      expenseCategory: expense.expenseCategory,
      amount: expense.amount,
      paymentMode: expense.paymentMode,
      mode: expense.mode,
      senderOrReceiver: expense.senderOrReceiver,
      expenseDate: new Date(expense.expenseDate).toISOString().substring(0, 16), // Format for date input
      notes: expense.notes,
      currency: expense.currency,
      customGrouping: expense.customGrouping
    });

    this.openExpenseForm.set(true);
  }

  initiate_update_expense(){
    if(this.expenseForm.valid){
        if(this.edit_expenseData()){
            this.update_expense( this.expenseForm.value);
        }
        else{
            this.mannualEntry(this.expenseForm.value);
        }

    }
  }

  private update_expense(updated_expense:ExtractedExpenseData){

        const updatedExpense: ExtractedExpenseData = Object.assign(this.edit_expenseData()!, updated_expense);
        this.extractedData.update(list => [...list]);
        this.edit_expenseData.set(null);

     this.openExpenseForm.set(false);
     this.resetExpenseForm();
  }

  addNewExpense(){
    this.openExpenseForm.set(true);
    this.resetExpenseForm();
  }

  mannualEntry(updated_expense:ExtractedExpenseData){
     const newExpense: ExtractedExpenseData = {
            ...updated_expense,
            expenseDate: new Date(updated_expense.expenseDate).toISOString(),
        } as ExtractedExpenseData;
        this.extractedData.update(list => [newExpense, ...list]);

     this.resetExpenseForm();
  }

  createExpense(){

    if(this.extractedData()){
        const createExpenseBody:CreateExpenseBody[] = this.extractedData().map(expense => ({
            expenseName: expense.expenseName,
            expenseCategory: expense.expenseCategory,
            amount: expense.amount,
            paymentMode: expense.paymentMode,
            mode: expense.mode,
            senderOrReceiver: expense.senderOrReceiver,
            expenseDate: new Date(expense.expenseDate).toISOString(),
            notes: expense.notes,
            currency: expense.currency || 'INR',
            customGrouping: expense.customGrouping
        } as CreateExpenseBody));

        this.expenseService.createExpense(createExpenseBody).subscribe({
            next: async (res:any) => {
                 await this.getExpenseList();
                 this.router.navigate(['/home']);
            }
    });
    }
  }

  async getExpenseList(){
     return await lastValueFrom(this.expenseService.getAllExpense());
  }
}
