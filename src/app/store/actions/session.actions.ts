import { createAction, props } from "@ngrx/store";

export const loginSuccess = createAction(
    '[Session] Login Success',
    props<{ sessionUserEmail: string }>()
);
  
export const logout = createAction('[Session] Logout');