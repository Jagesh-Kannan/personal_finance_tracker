import { createActionGroup, props } from "@ngrx/store";


export const UserActions = createActionGroup({
  source: 'User Data',
  events: {
    'Store New User': props<{ user:  UserState}>(),
    'update User': props<{user: UserState | any}>()
  },
});

