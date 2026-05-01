import { createReducer, on } from '@ngrx/store';
import { UserActions } from '../action/user.action';

export const userReducer = createReducer(
  { email: '', first_name: '', last_name: '' },
  on(UserActions.storeNewUser, (state, { user }) => ({ ...user })),
  on(UserActions.updateUser, (state, { user }) => ({ ...state, ...user })),
);
