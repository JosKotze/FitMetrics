// import { ActionReducer, INIT, UPDATE } from '@ngrx/store';
// import { AppState } from '../app.state';
// import { initialAuthState } from '../models/auth.model'; // Import initial states
// import { initialSessionState } from '../models/session.model';
// import { logout } from '../actions/session.actions';

// export function localStorageSyncReducer(
//   reducer: ActionReducer<AppState>
// ): ActionReducer<AppState> {
//   return (state, action) => {
//     if (action.type === INIT || action.type === UPDATE) {
//       const storedSessionState = localStorage.getItem('appState');
//       if (storedSessionState) {
//         const parsedState = JSON.parse(storedSessionState);
//         state = {
//           ...state,
//           session: parsedState || state?.session, // Merge or initialize session state
//           auth: state?.auth || initialAuthState, // Retain initial auth state if not in storage
//         };
//       }
//     }

//     const nextState = reducer(state, action);

//     if (action.type === logout.type) {
//       localStorage.removeItem('appState');
//     } else {
//       localStorage.setItem('appState', JSON.stringify(nextState.session));
//     }

//     return nextState;
//   };
// }


// export const metaReducers = [localStorageSyncReducer];
