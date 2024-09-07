import { createReducer, on } from "@ngrx/store";
import { initialSessionState } from "../models/session.model";
import { loginSuccess, logout } from "../actions/session.actions";

export const sessionReducer = createReducer(
    initialSessionState,
    on(loginSuccess, (state, { sessionUserEmail }) => {
        return {...state,
        isAuthenticated: true,
        sessionUserEmail: sessionUserEmail}
    }),
    on(logout, state => {
        return {...state,
        isAuthenticated: false,
        sessionUserEmail: ''}
    })
)