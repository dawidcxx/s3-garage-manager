import { App } from './App';
import { createBrowserRouter } from 'react-router-dom';
import { Overview } from './overview/Overview';
import { Buckets } from './buckets/Buckets';
import { Keys } from './keys/Keys';
import { Layout } from './layout/Layout';
import { RouteErrorPage } from './error/RouteErrorPage';
import { SettingsPage } from './settings/SettingsPage';
import { BrowsePage } from './browser/BrowsePage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        index: true,
        element: <Overview />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/layout',
        element: <Layout />,
      },
      {
        path: '/keys',
        element: <Keys />,
      },
      {
        path: '/buckets',
        element: <Buckets />,
      },
      {
        path: '/browse',
        element: <BrowsePage />
      }
    ],
  },
]);
