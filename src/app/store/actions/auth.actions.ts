import { createAction, props } from '@ngrx/store';

export const setAuthCode = createAction(
  '[Auth] Set Auth Code',
  props<{ authCode: string }>()
);

export const setAccessToken = createAction(
  '[Auth] Set Access Token',
  props<{ accessToken: string }>()
);

export const setAthleteProfilePicture = createAction(
  '[Auth] Set Athlete Profile Picture',
  props<{ athleteProfilePictureUrl: string }>()
);

export const setTestData = createAction(
  '[Auth] Set Test Data',
  props<{ testData: string }>()
);

export const setloginSuccess = createAction(
  '[Session] Login Success',
  props<{ sessionUsername: string }>()
);

export const setLogout = createAction('[Session] Logout');

export const setStravaUserAuthDetails = createAction(
  '[Auth] Set StravaUserAuthDetails',
  props<{ clientId: string | null; clientSecret: string | null }>()
);

// export const loginSuccess = createAction(
//   '[Session] Login Success',
//   props<{ sessionUserEmail: string }>()
// );

// export const logout = createAction('[Session] Logout');
