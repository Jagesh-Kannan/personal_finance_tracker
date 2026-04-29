import { createReducer, on } from "@ngrx/store";
import { UserActions } from "../action/user.action";


export const userReducer = createReducer(
  {} as UserState, 
  on(UserActions.storeNewUser, (state, { user }) => ( {...user} )),
  on(UserActions.updateUser, (state, {user})=>({...state,...user}))
);