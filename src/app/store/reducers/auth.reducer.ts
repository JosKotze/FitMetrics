import { createReducer, on } from '@ngrx/store';
import { setAccessToken, setAuthCode, setloginSuccess, setLogout, setTestData } from '../actions/auth.actions';
import { initialAuthState } from '../models/auth.model';


export const authReducer = createReducer(
  // initialState,
  // on(setAuthCode, (state, { code }) => ({ ...state, code })),
  // on(setAccessToken, (state, { accessToken }) => ({ ...state, accessToken }))
  initialAuthState,
  on(setAuthCode, (state, { authCode }) => {
    console.log('Setting auth code:', authCode);
    return { ...state, authCode };
  }),
  on(setAccessToken, (state, { accessToken }) => {
    console.log('Setting access token:', accessToken);
    return { ...state, accessToken };
  }),
  on(setTestData, (state, { testData }) => {
    console.log('set test data', testData);
    return { ...state, testData};
  }),
  on(setloginSuccess, (state, { sessionUsername: sessionUserEmail }) => {
    return {...state,
    isAuthenticated: true,
    sessionUserEmail: sessionUserEmail}
  }),
  on(setLogout, () => {
    return initialAuthState;
})
);
