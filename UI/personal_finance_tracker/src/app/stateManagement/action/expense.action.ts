import { createActionGroup, props } from "@ngrx/store";


export const ExpenseActions = createActionGroup({
  source: 'Expense API',
  events: {
    'Store New Expenses': props<{ expenses: ExpenseSchema[] }>(),
    'update Expense': props<{expense:ExpenseSchema}>()
  },
});

