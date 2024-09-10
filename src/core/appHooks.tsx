import { useContext } from 'react';
import { AppContext, AppDispatchContext } from './appContext';
import { AppDispatch, AppState } from './appReducer';

export function useAppDispatcher(): AppDispatch {
  const dispatch = useContext(AppDispatchContext);
  return dispatch!;
}

export function useAppState(): AppState {
  return useContext(AppContext);
}
