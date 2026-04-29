import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ExpenseActions } from '../stateManagement/action/expense.action';
import { UserActions } from '../stateManagement/action/user.action';

@Injectable({
  providedIn: 'root',
})
export class StateDispatch {
  constructor(private store: Store) {}

  public storeExpense(expense: ExpenseSchema[]) {
    this.store.dispatch(ExpenseActions.storeNewExpenses({ expenses: expense }));
  };

  public storeUser(user: UserState) {
    this.store.dispatch(UserActions.storeNewUser({ user: user }));
  };
}
