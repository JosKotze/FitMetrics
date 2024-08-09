import { ActionReducerMap } from "@ngrx/store";
import { AuthState } from "./models/auth.model";
import { authReducer } from "./reducers/auth.reducer";

export interface AppState {
  auth: AuthState;
}

export const appReducers: ActionReducerMap<AppState, any> = {
  auth: authReducer
};

