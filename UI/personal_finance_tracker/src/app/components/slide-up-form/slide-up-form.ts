import { Component, Input, Output, EventEmitter, signal, ViewChild, ElementRef, Signal, SimpleChanges } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { getExpenseList } from '../../stateManagement/selector/expense.selector';
import { Subscription } from 'rxjs';
import { AbsolutePipe } from '../custom-pipes/mathAbsolute';
import { SmartCurrencyPipe } from '../custom-pipes/currency-converter';
import { LucideMinus, LucidePlus } from '@lucide/angular';



@Component({
  selector: 'app-slide-up-form',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, AbsolutePipe, SmartCurrencyPipe, LucideMinus, LucidePlus],
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

  constructor() {}




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
  
  /**
   * Close tooltip
   */
  closeTooltip(): void {
    this.selectedTooltipExpenseId.set(null);
  }  

  private filterExpenseByFormData() : void {
    const filteredData = this.expensesList()
                        .filter(expense => {
                          const fromTime = new Date(this.formGroup.value.month.from).getTime();
                          const toTime = new Date(this.formGroup.value.month.to).getTime();
                          const expenseTime = new Date(expense.expenseDate).getTime();
                          return expenseTime >= fromTime && expenseTime <= toTime 
                          && (this.formGroup.value.category.toLowerCase() === 'all' 
                          || expense.expenseCategory.toLowerCase().includes(this.formGroup.value.category.toLowerCase()))
                          && (this.formGroup.value.paymentMode.toLowerCase() === 'all' 
                          || expense.paymentMode.toLowerCase().includes(this.formGroup.value.paymentMode.toLowerCase()));
                      })
                      .map(expense => ({...expense, isRemoved: false} as FilterableExpenseSchema));
    
    this.formGroup.get('filteredExpenses')?.setValue(filteredData, { emitEvent: false });
  }
  
  ngOnDestroy() {
    // Always unsubscribe when the component is destroyed
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }
}


