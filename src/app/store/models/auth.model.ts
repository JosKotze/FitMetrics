export interface AuthState {
  authCode: string | null;
  accessToken: string | null;
  testData: string | null
}

export const initialState: AuthState = {
  authCode: null,
  accessToken: null,
  testData: null,
};