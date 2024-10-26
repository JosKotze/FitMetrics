
export interface Startup {
    userId: number | null;
    userName: string | null;
    accessToken: string | null;
}

export const initialStartupState: Startup = {
    userId: null,
    userName: null,
    accessToken: null
}