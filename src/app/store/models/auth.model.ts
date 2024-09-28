
export interface AuthState {
  authCode: string | null;
  accessToken: string | null;
  testData: string | null;
  isAuthenticated: boolean;
  sessionUserEmail: string | null; 
  athleteProfilePictureUrl: string;
}

export const initialAuthState: AuthState = {
  authCode: null,
  accessToken: null,
  testData: null,
  isAuthenticated: false,
  sessionUserEmail: null,
  athleteProfilePictureUrl: ''
};