export interface AuthState {
  authCode: string;
  accessToken: string;
}

export const initialState: AuthState = {
  authCode: '',
  accessToken: ''
};