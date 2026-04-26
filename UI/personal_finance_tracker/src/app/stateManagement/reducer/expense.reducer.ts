import { createReducer, on } from "@ngrx/store";
import { ExpenseActions } from "../action/expense.action";


export const expenseReducer = createReducer(
  [] as ExpenseSchema[], 
  on(ExpenseActions.storeNewExpenses, (state, { expenses }) => ( [...expenses] )),
  on(ExpenseActions.updateExpense, (state, {expense})=>(state.map((item:ExpenseSchema)=>item._id===expense._id ? expense : item )))
);