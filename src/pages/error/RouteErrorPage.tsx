import { ToastType } from '@/lib/components/Toaster/Toast';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { ApiError, InvalidReponse, ServerError } from '@/lib/errors';
import clsx from 'clsx';
import { useLayoutEffect } from 'react';
import { isRouteErrorResponse, Link, useNavigate, useRouteError } from 'react-router-dom';

export function RouteErrorPage() {
  const navigate = useNavigate();
  const { toast } = useToaster();
  const error = useRouteError();
  console.error('RouteErrorPage - caught-error', error);
  const notFound = isNotFoundError(error);

  useLayoutEffect(() => {
    // Due to strict mode will toasts twice
    // but should be fine outside of dev mode
    toast(<> <strong>Permission Error</strong>: Check your token </>, ToastType.Error)
    navigate('/settings');
  }, [navigate, toast]);

  return (
    <div className="min-h-[70vh] flex flex-col justify-center items-center">
      <div className="bg-base-300 shadow-xl max-w-xl p-10 flex flex-col items-center gap-8 mt-8">
        <h2 className="text-4xl text-primary">
          Oops! <span className="text-slate-400">something went wrong</span>
        </h2>
        <div>
          {notFound && (
            <ErrorAlert
              title={'404 - Not Found'}
              message={
                'The page you are looking for does not exist. Please check the URL in the address bar and try again.'
              }
              variant={'warn'}
            />
          )}
          <ApiErrorAlert error={error} />
        </div>
        <Link to={'/'} className="btn btn-primary btn-outline">
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}

function isNotFoundError(e: unknown) {
  if (isRouteErrorResponse(e) && e.status === 404) {
    return true;
  } else {
    return false;
  }
}

function ApiErrorAlert(props: { error: unknown }) {
  const { error } = props;

  if (!(error instanceof ApiError)) {
    return null;
  }

  if (error instanceof ServerError) {
    return (
      <ErrorAlert
        title={'Server  Error'}
        message={
          'Unable to reach the server. Please try again later or check your garage server installation. For more details check browser network console.'
        }
        variant={'error'}
      />
    );
  }

  if (error instanceof InvalidReponse) {
    return (
      <ErrorAlert
        title="Invalid API Response"
        message={
          <div>
            The server returned a response that could not be understood.
            <details>
              <summary>Details</summary>
              <pre>{error.serializedErrors}</pre>
            </details>
          </div>
        }
        variant={'error'}
      />
    );
  }

  return <ErrorAlert title="API Errror Response" message={error.message} variant={'error'} />;
}

interface ErrorAlertProps {
  title: React.ReactNode;
  message: React.ReactNode;
  variant: 'error' | 'warn';
}

function ErrorAlert({ title = null, message, variant }: ErrorAlertProps) {
  return (
    <div
      className={clsx('alert w-full flex flex-col justify-start items-start gap-1', {
        'alert-warning': variant === 'warn',
        'alert-error': variant === 'error',
      })}
    >
      {title && <div className="font-semibold text-lg">{title}</div>}
      <div>{message}</div>
    </div>
  );
}
