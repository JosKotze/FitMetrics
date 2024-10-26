import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Startup } from "../models/startup.model";

export const selectStartupState  = createFeatureSelector<Startup>('startupState');

export const selectStartup = createSelector(
    selectStartupState,
    (state: Startup) => state
  );