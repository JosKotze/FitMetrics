// src/app/store/actions/startup.actions.ts

import { createAction, props } from '@ngrx/store';
import { Startup } from '../models/startup.model';

export const setStartupData = createAction(
  '[Startup] Set Startup Data',
  props<{ startup: Startup }>()
);

export const clearStartupData = createAction('[Startup] Clear Startup Data'); // Optional: to reset state
