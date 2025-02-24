
export interface AuthState {
  stravaClientId: string | null;
  stravaClientSecret: string | null;
  authCode: string | null;
  accessToken: string | null;
  testData: string | null;
  isAuthenticated: boolean;
  sessionUserEmail: string | null; 
  athleteProfilePictureUrl: string;
}

export const initialAuthState: AuthState = {
  stravaClientId: null,
  stravaClientSecret:  null,
  authCode: null,
  accessToken: null,
  testData: null,
  isAuthenticated: false,
  sessionUserEmail: null,
  athleteProfilePictureUrl: ''
};