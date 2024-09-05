import { App } from '@/App';
import { createBrowserRouter } from 'react-router-dom';
import { Overview } from './overview/Overview';
import { Buckets } from './buckets/Buckets';
import { Keys } from './keys/Keys';
import { Layout } from './layout/Layout';
import { RouteErrorPage } from './error/RouteErrorPage';

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
    ],
  },
]);
