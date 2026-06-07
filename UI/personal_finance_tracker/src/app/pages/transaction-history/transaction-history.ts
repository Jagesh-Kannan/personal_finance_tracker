import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, computed, effect, signal, Signal, OnDestroy } from '@angular/core';
import { LucideFunnel, LucideTrash2, LucideCheck, LucideListChecks, LucideEye } from '@lucide/angular';
import { ButtonLoader } from '../../components/loader/loader';
import { LucidIconModule } from '../../components/lucidIcon/lucid-icon/lucid-icon-module';
import { SlideUpForm } from '../../components/slide-up-form/slide-up-form';
import { getExpenseList } from '../../stateManagement/selector/expense.selector';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ExpenseService } from '../../service/expense.service';
import { lastValueFrom } from 'rxjs/internal/lastValueFrom';
import { ToasterService } from '../../service/toaster.service';
import { DialogService } from '../../service/confirmation-dialog.service';
import { ExpenseListContainer } from '../../components/expense-list/expense-list-container/expense-list-container';
import { ExpenseListCard } from '../../components/expense-list/expense-list-card/expense-list-card';

@Component({
  selector: 'app-transaction-history',
  imports: [
    LucideFunnel,
    CommonModule,
    LucidIconModule,
    LucideTrash2,
    LucideCheck,
    LucideListChecks,
    LucideEye,
    ButtonLoader,
    SlideUpForm,
    ExpenseListContainer,
    ExpenseListCard
  ],
  providers: [CurrencyPipe],
  templateUrl: './transaction-history.html',
  styleUrl: './transaction-history.css',
})
export class TransactionHistory implements OnDestroy {
  public expensesList: Signal<ExpenseSchema[]> = getExpenseList();

  public openExpenseForm = signal<boolean>(false);
  public expenseForm!: FormGroup;
  protected readonly updateExpenseLoader;
  protected readonly deleteExpenseLoader;
  public overviewFilterForm!: FormGroup;
  public openFilterForm = signal<boolean>(false);
  public filteredExpenseList = signal<FilterableExpenseSchema[]>([]);
  public storeRemovedExpense = signal<FilterableExpenseSchema[]>([]);
  public isDeletePopoverOpen = signal<boolean>(false);
  public enableSelectionMode = signal<boolean>(false);

  constructor(
    private expenseService: ExpenseService,
    private _fb: FormBuilder,
    private toasterService: ToasterService,
    private dialogService: DialogService
  ) {
    effect(() => {
      const expense = this.expensesList();
      this.filterExpenseByFormData();
    });
    this.updateExpenseLoader = computed(() => this.expenseService.updateExpenseLoader());
    this.deleteExpenseLoader = computed(() => this.expenseService.deleteExpenseLoader());

    this.generateExpenseForm();
    this.generateOverviewFilterForm();
  }

  private generateExpenseForm() {
    this.expenseForm = this._fb.group({
      _id: ['', Validators.required],
      expenseName: ['', Validators.required],
      expenseCategory: ['', Validators.required],
      amount: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      userId: ['', Validators.required],
      paymentMode: ['', Validators.required],
      mode: ['DEBITED', Validators.required],
      senderOrReceiver: [''],
      transactionDate: ['', Validators.required],
      notes: [''],
      currency: ['INR', Validators.required],
      customGrouping: [''],
      __v: [0],
      createdAt: ['', Validators.required],
      updatedAt: ['', Validators.required],
    });
  }
  private resetExpenseForm() {
    this.expenseForm.reset({
      expenseName: '',
      expenseCategory: '',
      amount: '',
      paymentMode: '',
      mode: 'DEBITED',
      senderOrReceiver: '',
      transactionDate: '',
      notes: '',
      currency: 'INR',
      customGrouping: '',
    });
  }

  private generateOverviewFilterForm() {
    this.overviewFilterForm = this._fb.group({
      month: this._fb.group({
        from: [],
        to: [],
      }),
      searchKey: [''],
      paymentMode: ['ALL'],
    });
  }

  openEditExpenseForm(expense: ExpenseSchema) {
    this.expenseForm.patchValue({
      ...expense,
      transactionDate: new Date(expense.transactionDate).toISOString().substring(0, 16),
    });
    this.openExpenseForm.set(true);
  }

  public openExpenseFilter() {
    this.openFilterForm.set(true);
  }

  initiate_update_expense() {
    if (this.expenseForm.valid) {
      const updatedExpense: ExpenseSchema = this.expenseForm.value;
      this.updateExpense(updatedExpense);
    }
  }

  updateExpense(updatedData: ExpenseSchema) {
    updatedData.updatedAt = new Date().toISOString();
    this.expenseService.updateExpense(updatedData).subscribe({
      next: async (res: any) => {
        await this.getExpenseList();
        this.openExpenseForm.set(false);
        this.resetExpenseForm();
      },
      error: (err) => {
        this.openExpenseForm.set(false);
        this.resetExpenseForm();
      },
    });
  }

  public filterExpenseList() {
    this.openFilterForm.set(false);
    this.filterExpenseByFormData();
  }

  private filterExpenseByFormData(): void {
    const removedExpenseIds = this.storeRemovedExpense().map((exp) => exp._id);

    this.filteredExpenseList.set(
      ...[
        this.expensesList()
          .filter((expense) => {
            // 1. Extract values safely with defaults
            const fromVal = this.overviewFilterForm.value.month?.from;
            const toVal = this.overviewFilterForm.value.month?.to;
            const searchKey = (this.overviewFilterForm.value.searchKey || '').toLowerCase();
            const paymentMode = (this.overviewFilterForm.value.paymentMode || 'all').toLowerCase();

            // 2. CHECK IF FORM IS EMPTY: If all filter values are empty or default, show everything
            const isFormEmpty = !fromVal && !toVal && searchKey === '' && paymentMode === 'all';
            if (isFormEmpty) return true;

            // 3. Date Range validation (only check if dates exist)
            let matchesDate = true;
            if (fromVal && toVal) {
              const fromTime = new Date(fromVal).getTime();
              const toTime = new Date(toVal).getTime();
              const expenseTime = new Date(expense.transactionDate).getTime();
              matchesDate = expenseTime >= fromTime && expenseTime <= toTime;
            }

            // 4. Search Key match condition
            const matchesSearch =
              searchKey === '' ||
              (expense.expenseCategory || '').toLowerCase().includes(searchKey) ||
              (expense.customGrouping || '').toLowerCase().includes(searchKey) ||
              (expense.mode || '').toLowerCase().includes(searchKey) ||
              (expense.senderOrReceiver || '').toLowerCase().includes(searchKey);

            // 5. Payment Mode match condition
            const matchesPayment =
              paymentMode === 'all' ||
              (expense.paymentMode || '').toLowerCase().includes(paymentMode);

            // 6. Combine all active constraints
            return matchesDate && matchesSearch && matchesPayment;
          })
          .map((expense) => {
            const wasRemoved = removedExpenseIds.includes(expense._id);

            return {
              ...expense,
              isRemoved: wasRemoved,
            } as FilterableExpenseSchema;
          })  
         .sort((a,b)=> new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
          ,
      ],
    );
  }

  addOrRemoveExpense(expense: FilterableExpenseSchema) {
    expense.isRemoved = !expense.isRemoved;

    if (expense.isRemoved) {
      const exists = this.storeRemovedExpense().some((item) => item._id === expense._id);
      if (!exists) {
        this.storeRemovedExpense.set([...this.storeRemovedExpense(), expense]);
      }
    } else {
      this.storeRemovedExpense.set(
        this.storeRemovedExpense().filter((item) => item._id !== expense._id),
      );
    }
  }
  async getExpenseList() {
    return await lastValueFrom(this.expenseService.getAllExpense());
  }

  initiate_delete_expenses(type: 'selected' | 'all'){
    const message = type === 'selected' 
    ? 'Are you sure you want to delete the selected expenses? This action cannot be undone.' 
    : 'Are you sure you want to delete ALL expenses? This action cannot be undone.';

    this.dialogService.open({
      title: 'Confirm Deletion',
      message: message,
      actions: [
        { label: 'Cancel', position: 'left', callback: () => null },
        { label: 'Delete', position: 'right', callback: () => type === 'selected' ? this.deleteSelectedExpenses() : this.deleteAllExpenses(), class: 'danger' }
      ]
    });
  }

    showDeleteConfirmation(message:string){
    this.dialogService.open({
  title: 'Confirm Deletion',
  message: message,
  actions: [
    { label: 'Cancel', position: 'left', callback: () => null },
    { label: 'Delete', position: 'right', callback: () => console.log('Delete clicked'), class: 'danger' }
  ]
});
  }
  
  public deleteSelectedExpenses() {


    const selectedExpenses = this.storeRemovedExpense();
    if (selectedExpenses.length === 0) {
      this.toasterService.showError('No expenses selected for deletion!');
      return;
    }

    const expenseIds = selectedExpenses.map((expense) => expense._id);
    this.expenseService.deleteExpenses(expenseIds).subscribe({
      next: async (res: any) => {
        await this.getExpenseList();
        this.storeRemovedExpense.set([]);
        this.enableSelectionMode.set(false);
        this.isDeletePopoverOpen.set(false);
      },
      error: (err) => {
        this.isDeletePopoverOpen.set(false);
      },
    });
  }

  public deleteAllExpenses() {
    const allExpenses = this.filteredExpenseList();
    if (allExpenses.length === 0) {
      this.toasterService.showError('No expenses to delete');
      return;
    }

    this.expenseService.deleteAllExpenses().subscribe({
      next: async (res: any) => {
        await this.getExpenseList();
        this.storeRemovedExpense.set([]);
        this.filteredExpenseList.set([]);
        this.isDeletePopoverOpen.set(false);
      },
      error: (err) => {
        console.error('Error deleting all expenses:', err);
        this.isDeletePopoverOpen.set(false);
      },
    });
  }



  ngOnDestroy() {
    this.storeRemovedExpense.set([]);
    this.enableSelectionMode.set(false);
  }
}
