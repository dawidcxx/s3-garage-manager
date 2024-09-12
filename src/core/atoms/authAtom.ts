import { mapOptional, Optional } from '@/lib/util/mapOptional';
import { atom } from 'jotai';
import { produce } from 'immer'
export interface AuthState {
  token: string;
  saveToLocalStorage: boolean;
}

const DEFAULT_AUTH_STATE: AuthState = { token: '', saveToLocalStorage: true };

export const authAtom = atom(getFromLocalStorage() ?? DEFAULT_AUTH_STATE, (get, set, update: AuthState) => {
  set(authAtom, update);

  saveToLocalStorage(produce(update, (draft) => {
    // Only save the token to local storage if the user has opted in
    if (!draft.saveToLocalStorage) {
      draft.token = '';
    }
  }));

});

function saveToLocalStorage(dashboardSettings: AuthState) {
  localStorage.setItem('auth', JSON.stringify(dashboardSettings));
}

function getFromLocalStorage(): Optional<AuthState> {
  return mapOptional(
    localStorage.getItem('auth'),
    (dashboardSettingsFromLS) => JSON.parse(dashboardSettingsFromLS) as AuthState,
  );
}
