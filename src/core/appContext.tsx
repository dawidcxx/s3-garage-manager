import { createContext } from 'react';
import { AppDispatch, AppState } from './appReducer';

// eslint-disable-next-line react-refresh/only-export-components
export const APP_INIT_STATE: AppState = {
  auth: { token: '', saveToLocalStorage: false },
  settings: { defaultAwsRegion: '' },
};

export const AppContext = createContext<AppState>(APP_INIT_STATE);

export const AppDispatchContext = createContext<AppDispatch | null>(null);
