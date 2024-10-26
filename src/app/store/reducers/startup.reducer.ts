import { createReducer, on } from "@ngrx/store";
import { loginSuccess } from "../actions/session.actions";
import { initialStartupState } from "../models/startup.model";
import { clearStartupData, setStartupData } from "../actions/startup.actions";

export const startupReducer = createReducer(
    initialStartupState,
    on(setStartupData, (state, { startup }) => ({
        ...state,
        ...startup,
    })),
    on(clearStartupData, () => initialStartupState) // Reset to initial state if needed
);