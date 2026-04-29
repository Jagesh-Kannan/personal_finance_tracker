import { inject, WritableSignal } from "@angular/core"
import { Store } from "@ngrx/store";
import { ExpenseActions } from "../action/expense.action";



export const getExpenseList = () => { 
  const store = inject(Store);
  return store.selectSignal((state: any) => state.expenses);
} 


