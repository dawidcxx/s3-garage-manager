import { createContext } from 'react';
import { AppDispatch, AppState } from './appReducer';
import { mapOptional } from '@/lib/util/mapOptional';

// eslint-disable-next-line react-refresh/only-export-components
export const APP_INIT_STATE: AppState = mapOptional(
  localStorage.getItem('appState'),
  (it) => JSON.parse(it) as AppState,
) ?? {
  auth: { token: '', saveToLocalStorage: true },
  settings: { defaultAwsRegion: '' },
};

export const AppContext = createContext<AppState>(APP_INIT_STATE);
export const AppDispatchContext = createContext<AppDispatch | null>(null);
