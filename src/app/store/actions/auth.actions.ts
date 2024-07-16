import { createAction, props } from '@ngrx/store';

export const setAuthCode = createAction(
    '[Auth] Set Auth Code',
    props<{ code: string }>()
  );


export const setAccessToken = createAction(
    '[Auth] Set Access Token',
    props<{ accessToken: string }>()
  );
