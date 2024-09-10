import { assertNever } from '@/lib/util/assert-never';

export interface AppState {
  auth: {
    token: string;
    saveToLocalStorage: boolean;
  };
  settings: {
    defaultAwsRegion: string;
  };
}

export type UpdateAppSettings = { type: 'UPDATE_APP_SETTINGS'; payload: Partial<AppState> };
export type ClearToken = { type: 'CLEAR_TOKEN' };
export type AppAction = UpdateAppSettings | ClearToken;
export type AppDispatch = React.Dispatch<AppAction>;

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'UPDATE_APP_SETTINGS': {
      return { ...state, ...action.payload };
    }
    case 'CLEAR_TOKEN': {
      return {
        auth: { token: '', saveToLocalStorage: true },
        settings: { defaultAwsRegion: '' },
      };
    }
    default: {
      assertNever(action);
    }
  }
}
