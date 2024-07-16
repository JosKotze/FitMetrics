import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../models/auth.model";

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthCode = createSelector( selectAuthState, (state: AuthState) => state.authCode)

export const selectAcceesToken = createSelector( selectAuthState, (state: AuthState) => state.accessToken)