import { createReducer, on } from '@ngrx/store';
import { setAccessToken, setAuthCode } from '../actions/auth.actions';
import { initialState } from '../models/auth.model';


export const authReducer = createReducer(
  initialState,
  on(setAuthCode, (state, { code }) => ({ ...state, code })),
  on(setAccessToken, (state, { accessToken }) => ({ ...state, accessToken }))
);
