import { createAction, props } from '@ngrx/store';

export const setAuthCode = createAction(
    '[Auth] Set Auth Code',
    props<{ authCode: string }>()
  );

export const setAccessToken = createAction(
    '[Auth] Set Access Token',
    props<{ accessToken: string }>()
  );

export const setTestData = createAction(
  '[Auth] Set Test Data',
  props<{ testData: string }>()
)