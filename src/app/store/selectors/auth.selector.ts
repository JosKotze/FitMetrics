import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from '../models/auth.model';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectAuthCode = createSelector(
  selectAuthState,
  (state: AuthState) => state.authCode
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.accessToken
);

export const selectTestData = createSelector(
  selectAuthState,
  (state: AuthState) => state.testData
);

export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state: AuthState) => state.isAuthenticated
);

export const selectSessionUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.sessionUserEmail
);

export const selectProfileAvatar = createSelector(
  selectAuthState,
  (state: AuthState) => state.athleteProfilePictureUrl
);