import clsx from 'clsx';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import GarageLogoImage from '@/assets/garage-logo-horizontal.svg';
import { Suspense, useEffect, useReducer } from 'react';
import { IconKey } from './lib/components/icons/IconKey';
import { Toaster } from './lib/components/Toaster/Toaster';
import { appReducer, AppState } from './core/appReducer';
import { APP_INIT_STATE, AppContext, AppDispatchContext } from './core/appContext';
import { s3GarageClient } from './api/garage/s3-garage-client';
import { useAppDispatcher } from './core/appHooks';
import { produce } from 'immer';

export function App() {
  const [state, dispatch] = useReducer(appReducer, APP_INIT_STATE);

  useEffect(() => {
    s3GarageClient.setToken(state.auth.token);
    syncWithLocalStorage(state);
  }, [state]);

  return (
    <AppContext.Provider value={state}>
      {/* {JSON.stringify(state,null,2)} */}
      <AppDispatchContext.Provider value={dispatch}>
        <AppLayout />
      </AppDispatchContext.Provider>
    </AppContext.Provider>
  );
}

function AppLayout() {
  const appDispatch = useAppDispatcher();
  const navigate = useNavigate();
  return (
    <div className="flex flex-row">
      <Toaster />
      <div className="drawer lg:drawer-open">
        <input id="app-drawer-toggle" type="checkbox" className="drawer-toggle" />

        <main className="drawer-content p-4">
          <Suspense fallback={'Loading...'}>
            <Outlet />
          </Suspense>
        </main>

        <nav className="drawer-side">
          <label htmlFor="app-drawer-toggle" aria-label="close sidebar" className="drawer-overlay"></label>

          <div className="min-h-full flex flex-col bg-base-200">
            <Link to={'/'} className="flex justify-center bg-base-200 pt-4 relative" tabIndex={-1}>
              <img src={GarageLogoImage} />
              <div className="absolute top-[66px] left-[138px] badge badge-warning">admin</div>
            </Link>
            <div className="divider"></div>
            <ul className="menu text-base-content w-64 p-4 gap-1">
              <li>
                <NavLink to={'/'} className={({ isActive }) => clsx(isActive && 'active')}>
                  <IconInfo /> Overview
                </NavLink>
              </li>
              <li>
                <NavLink to={'/layout'} className={({ isActive }) => clsx(isActive && 'active')}>
                  <IconLayout /> Layout
                </NavLink>
              </li>
              <li>
                <NavLink to={'/keys'} className={({ isActive }) => clsx(isActive && 'active')}>
                  <IconKey /> Keys
                </NavLink>
              </li>
              <li>
                <NavLink to={'/buckets'} className={({ isActive }) => clsx(isActive && 'active')}>
                  <IconBox /> Buckets
                </NavLink>
              </li>
            </ul>
            <div className="divider" />
            <ul className="menu text-base-content w-64 p-4 flex-grow">
              <li>
                <NavLink to={'/settings'} className={({ isActive }) => clsx(isActive && 'active')}>
                  <IconBxsCog /> Settings
                </NavLink>
              </li>
              <li>
                <button
                  className="hover:text-red-400 hover:outline-error"
                  onClick={(e) => {
                    navigate('/settings');
                    appDispatch({ type: 'CLEAR_TOKEN' });
                    e.currentTarget.blur();
                  }}
                >
                  <IconExit /> Clear Token
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

function IconInfo() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" height="1em" width="1em">
      <path
        fillRule="evenodd"
        d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM0 8a8 8 0 1116 0A8 8 0 010 8zm6.5-.25A.75.75 0 017.25 7h1a.75.75 0 01.75.75v2.75h.25a.75.75 0 010 1.5h-2a.75.75 0 010-1.5h.25v-2h-.25a.75.75 0 01-.75-.75zM8 6a1 1 0 100-2 1 1 0 000 2z"
      />
    </svg>
  );
}

function IconLayout() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1rem"
      height="1rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="7" x="3" y="3" rx="1" />
      <rect width="9" height="7" x="3" y="14" rx="1" />
      <rect width="5" height="7" x="16" y="14" rx="1" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="1rem"
      height="1rem"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.3 7 8.7 5 8.7-5" />
      <path d="M12 22V12" />
    </svg>
  );
}

function IconExit() {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" height="1em" width="1em">
      <path fill="currentColor" d="M12 10V8H7V6h5V4l3 3zm-1-1v4H6v3l-6-3V0h11v5h-1V1H2l4 2v9h4V9z" />
    </svg>
  );
}

function IconBxsCog() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" height="1em" width="1em">
      <path d="M2.344 15.271l2 3.46a1 1 0 001.366.365l1.396-.806c.58.457 1.221.832 1.895 1.112V21a1 1 0 001 1h4a1 1 0 001-1v-1.598a8.094 8.094 0 001.895-1.112l1.396.806c.477.275 1.091.11 1.366-.365l2-3.46a1.004 1.004 0 00-.365-1.366l-1.372-.793a7.683 7.683 0 00-.002-2.224l1.372-.793c.476-.275.641-.89.365-1.366l-2-3.46a1 1 0 00-1.366-.365l-1.396.806A8.034 8.034 0 0015 4.598V3a1 1 0 00-1-1h-4a1 1 0 00-1 1v1.598A8.094 8.094 0 007.105 5.71L5.71 4.904a.999.999 0 00-1.366.365l-2 3.46a1.004 1.004 0 00.365 1.366l1.372.793a7.683 7.683 0 000 2.224l-1.372.793c-.476.275-.641.89-.365 1.366zM12 8c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4z" />
    </svg>
  );
}

function syncWithLocalStorage(state: AppState) {
  const stateWithMaskedToken = produce(state, (it) => {
    if (it.auth.saveToLocalStorage === false) {
      // don't save the token unless explicitly told to
      it.auth.token = '';
    }
  });

  localStorage.setItem('appState', JSON.stringify(stateWithMaskedToken));
}
