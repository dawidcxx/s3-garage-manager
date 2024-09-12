import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider } from 'react-router-dom';
import { router } from './pages/router.tsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { AtomEffects } from './core/AtomEffects.tsx';

const client = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 0,
      gcTime: 0,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <JotaiProvider>
      <AtomEffects>
        <QueryClientProvider client={client}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </AtomEffects>
    </JotaiProvider>
  </StrictMode>,
);
