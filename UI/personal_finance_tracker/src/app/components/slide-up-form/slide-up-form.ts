import { Component, Input, Output, EventEmitter, signal, ViewChild, ElementRef, Signal, SimpleChanges, computed } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { getExpenseList } from '../../stateManagement/selector/expense.selector';
import { Subscription } from 'rxjs';
import { AbsolutePipe } from '../custom-pipes/mathAbsolute';
import { SmartCurrencyPipe } from '../custom-pipes/currency-converter';
import {LucideMinus, LucidePlus, LucideSave } from '@lucide/angular';
import { ExpenseService } from '../../service/expense.service';
import { ButtonLoader } from '../loader/loader';
import { ExpenseListContainer } from '../expense-list/expense-list-container/expense-list-container';
import { ExpenseListCard } from '../expense-list/expense-list-card/expense-list-card';



@Component({
  selector: 'app-slide-up-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AbsolutePipe, 
    SmartCurrencyPipe, LucideMinus, LucidePlus, LucideSave, ExpenseListContainer,
    ExpenseListCard, ButtonLoader],
  providers: [CurrencyPipe],
  templateUrl: './slide-up-form.html',
  styleUrl: './slide-up-form.css',
})
export class SlideUpForm {
  /**
   * Determines which form content to display
   * 'manual-entry' - Expense manual entry form
   * 'overview-filter' - Overview page filter form
   * 'custom' - Custom content passed via contentTemplate
   */
  @Input() formType: FormContentType = 'manual-entry';

  /**
   * Controls whether the form is visible
   */
  @Input() isOpen = signal(false);

  /**
   * The form group to be used in the form
   */
  @Input() formGroup!: FormGroup;

  /**
   * Title to display in the adaptive header
   */
  @Input() title: string = 'Form';

  /**
   * Title word (first part of title, typically styling)
   */
  @Input() titleWord: string = 'Manual';

  /**
   * Title name (second part of title, typically styling)
   */
  @Input() titleName: string = 'Entry';

  /**
   * Description text
   */
  @Input() description: string = 'Fill in the details to add your expense manually.';

  /**
   * Button text for submit action
   */
  @Input() buttonText: string = 'Update Transaction';

  /**
   * Loading state for button
   */
  @Input() isLoading = signal(false);

  /**
   * Emitted when form is submitted
   */
  @Output() onSubmit = new EventEmitter<any>();

  /**
   * Emitted when form is closed
   */
  @Output() onClose = new EventEmitter<void>();


  private formSub!: Subscription;
  
  private expensesList: Signal<ExpenseSchema[]> = getExpenseList();
  
  public selectedTooltipExpenseId = signal<string | null>(null);
  public editingExpense = signal<any | null>(null);
  public readOnlyForm = signal<boolean>(false);
  public isAdditionalExpanded = signal<boolean>(false);
  public isClosing = signal<boolean>(false);
  public readonly updateExpenseLoader;
  private storeRemovedExpense = signal<FilterableExpenseSchema[]>([]);
  private touchStartY: number = 0;
  private touchStartX: number = 0;

  constructor(private expenseService:ExpenseService) {
    this.updateExpenseLoader = computed(() => this.expenseService.updateExpenseLoader());
  }




  ngOnChanges(changes: SimpleChanges) {
    if (changes['formGroup'] && this.formGroup) {
      if (this.formSub) {
        this.formSub.unsubscribe();
      }
      this.formSub = this.formGroup.valueChanges.subscribe(value => {
        if (this.formType === 'overview-filter')  this.filterExpenseByFormData();    
      });
      if(this.formType === 'overview-filter' && this.expensesList() && this.expensesList().length > 0) this.filterExpenseByFormData();
    }

    if (changes['formType']){
       if(changes['formType'].currentValue === "view-transaction") this.readOnlyForm.set(true);
       else this.readOnlyForm.set(false);
    }
  }

  /**
   * Handles form submission
   */
  handleSubmit() {
    if (this.formGroup && this.formGroup.valid) {
      this.onSubmit.emit(this.formGroup.value);
    }
  }

  /**
   * Handles closing the form
   */
  handleClose() {
    this.isOpen.set(false);
    this.onClose.emit();
  }

  /**
   * Track form type for template
   */
  getFormType(): FormContentType {
    return this.formType;
  }
  
  /**
   * Toggle tooltip visibility for an expense card
   */
  toggleExpenseTooltip(expenseId: string): void {
    this.selectedTooltipExpenseId.set(
      this.selectedTooltipExpenseId() === expenseId ? null : expenseId
    );
  }
  
  addOrRemoveExpense(expense: FilterableExpenseSchema, mode: 'add' | 'remove') {
    if (mode === 'add') {
      expense.isRemoved = false;
      // Remove from storeRemovedExpense
      this.storeRemovedExpense.set(
        this.storeRemovedExpense().filter(item => item._id !== expense._id)
      );
    } else {
      expense.isRemoved = true;
      // Add to storeRemovedExpense if not already there
      const exists = this.storeRemovedExpense().some(item => item._id === expense._id);
      if (!exists) {
        this.storeRemovedExpense.set([...this.storeRemovedExpense(), expense]);
      }
    }
  }
  /**
   * Close tooltip
   */
  closeTooltip(): void {
    this.selectedTooltipExpenseId.set(null);
  }

  /**
   * Begin editing an expense - create a shallow copy for editing
   */
  editExpense(expense: any): void {
    const copy = { ...expense };
    if (copy.transactionDate) {
      copy.transactionDate = this.toDateTimeLocalString(copy.transactionDate);
    }
    this.editingExpense.set(copy);
  }

  /**
   * Check if the given expense is currently being edited
   */
  isEditingExpense(expense: any): boolean {
    return !!(this.editingExpense() && this.editingExpense()._id === expense._id);
  }

  /**
   * Update action for the edited expense - currently just logs the updated object
   */
  updateExpense(): void {
    const updated = this.editingExpense();
    if (!updated) return;

    this.expenseService.updateExpense(updated).subscribe({
      next: (res: any) => {
           this.expenseService.getAllExpense().subscribe();
            this.editingExpense.set(null);
    this.selectedTooltipExpenseId.set(null);
      },
      error: (err:any) =>{
         this.editingExpense.set(null);
    this.selectedTooltipExpenseId.set(null);
      },
    })
   
  }

  private toDateTimeLocalString(value: any): string {
    const d = new Date(value);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 16);
  }

private filterExpenseByFormData(): void {
  const removedExpenseIds = this.storeRemovedExpense().map(exp => exp._id);

  const filteredData = this.expensesList()
    .filter(expense => {
      const fromTime = new Date(this.formGroup.value.month.from).getTime();
      const toTime = new Date(this.formGroup.value.month.to).getTime();
      const expenseTime = new Date(expense.transactionDate).getTime();
      
      return expenseTime >= fromTime && expenseTime <= toTime 
        && (this.formGroup.value.searchKey.toLowerCase() === '' 
        || expense.expenseCategory.toLowerCase().includes(this.formGroup.value.searchKey.toLowerCase())
        || expense.customGrouping.toLowerCase().includes(this.formGroup.value.searchKey.toLowerCase())
        || expense.mode.toLowerCase().includes(this.formGroup.value.searchKey.toLowerCase())
        || expense.senderOrReceiver.toLowerCase().includes(this.formGroup.value.searchKey.toLowerCase())
      )
        && (this.formGroup.value.paymentMode.toLowerCase() === 'all' 
        || expense.paymentMode.toLowerCase().includes(this.formGroup.value.paymentMode.toLowerCase()));
    })
    .map(expense => {
      const wasRemoved = removedExpenseIds.includes(expense._id);

      return {
        ...expense,
        isRemoved: wasRemoved
      } as FilterableExpenseSchema;
    })
    .sort((a,b)=> new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime());

  this.formGroup.get('filteredExpenses')?.setValue(filteredData, { emitEvent: false });
}

  
  ngOnDestroy() {
    // Always unsubscribe when the component is destroyed
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
    this.storeRemovedExpense.set([])
  }

  /**
   * Handle touch start on form
   */
  onFormTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
    this.touchStartX = event.touches[0].clientX;
  }

  /**
   * Handle touch move on form
   */
  onFormTouchMove(event: TouchEvent): void {
    // Allow natural scrolling behavior
  }

  /**
   * Handle touch end on form - detect swipe down
   */
  onFormTouchEnd(event: TouchEvent): void {
    const touchEndY = event.changedTouches[0].clientY;
    const touchEndX = event.changedTouches[0].clientX;
    const swipeDistanceY = touchEndY - this.touchStartY;
    const swipeDistanceX = Math.abs(touchEndX - this.touchStartX);
    const minimumSwipeDistance = 50; // Minimum pixels to trigger close
    const maxHorizontalDrift = 30; // Max horizontal movement allowed

    // If swiped down more than minimum distance and not scrolling horizontally, close the form
    if (
      swipeDistanceY > minimumSwipeDistance &&
      swipeDistanceX < maxHorizontalDrift
    ) {
      this.closeWithAnimation();
    }
  }

  /**
   * Close form with slide down animation
   */
  private closeWithAnimation(): void {
    this.isClosing.set(true);
    // Wait for animation to complete before closing
    setTimeout(() => {
      this.isClosing.set(false);
      this.handleClose();
    }, 300); // Match animation duration from CSS
  }
}


