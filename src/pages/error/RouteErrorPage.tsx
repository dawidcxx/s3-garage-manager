import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom';

export function RouteErrorPage() {
  const error = useRouteError();
  console.error('RouteErrorPage - caught-error', error);

  const notFound = isNotFoundError(error);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto h-12 w-12 text-primary" />
        <h1 className="mt-4 text-6xl font-bold tracking-tight text-foreground sm:text-7xl">
          Oops, something went wrong!
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {notFound && "It looks like the page you were looking for doesn't exist"}
        </p>
        <div className="mt-6">
          <Link to={'/'} className="btn btn-primary btn-outline">
            Go to Homepage
          </Link>
        </div>
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
