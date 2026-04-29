import { inject, WritableSignal } from "@angular/core"
import { Store } from "@ngrx/store";
import { UserActions } from "../action/user.action";



export const getUser= () => { 
  const store = inject(Store);
  return store.selectSignal((state: any) => state.user);
} 

