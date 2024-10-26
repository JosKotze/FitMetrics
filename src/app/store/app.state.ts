import { ActionReducerMap } from "@ngrx/store";
import { AuthState } from "./models/auth.model";
import { authReducer } from "./reducers/auth.reducer";
import { SessionState } from "./models/session.model";
import { sessionReducer } from "./reducers/session.reducer";
import { Startup } from "./models/startup.model";
import { startupReducer } from "./reducers/startup.reducer";

export interface AppState {
  auth: AuthState;
  session: SessionState;
  startupState: Startup;
}

export const appReducers: ActionReducerMap<AppState, any> = {
  auth: authReducer,
  session: sessionReducer,
  startupState: startupReducer,
};

