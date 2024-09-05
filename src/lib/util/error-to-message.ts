import { ApiError, BadRequestError } from '../errors';
import { isNil } from './isNil';

export function errorToMessage(e: unknown): string {
  if (isNil(e)) {
    console.error('Nil error', e);
    return 'Unknown error';
  }

  if (e instanceof BadRequestError) {
    return e.message;
  } else if (e instanceof ApiError) {
    return e.message;
  } else if (e instanceof Error) {
    return e.message;
  }

  if (Object.prototype.hasOwnProperty.call(e, 'message')) {
    return (e as { message: string }).message;
  }

  console.error('Unknown error', e);
  return 'Unknown error';
}
