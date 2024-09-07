import { createFeatureSelector, createSelector } from "@ngrx/store";
import { SessionState } from "../models/session.model";

export const selectSessionState  = createFeatureSelector<SessionState>('session');

export const selectIsAuthenticated = createSelector(
  selectSessionState,
  (state: SessionState) => state.isAuthenticated
);

export const selectSessionUser = createSelector(
  selectSessionState,
  (state: SessionState) => state.sessionUserEmail
);