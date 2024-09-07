export interface SessionState {
    isAuthenticated: boolean;
    sessionUserEmail: string | null; 
}

export const initialSessionState: SessionState = {
    isAuthenticated: false,
    sessionUserEmail: null
};