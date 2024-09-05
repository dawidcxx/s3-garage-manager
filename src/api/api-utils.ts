import { FetchResponse } from 'openapi-fetch';
import { isNil } from '@/lib/util/isNil';
import { ApiError, BadRequestError } from '@/lib/errors';
import { requireNotNull } from '@/lib/util/require-not-null';
import { isString } from '@/lib/util/is-string';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function checkResponse<T>(schema: Zod.ZodSchema<T>, { response, data, error }: FetchResponse<any, any, any>): T {

  if (!isNil(error) || !response.ok) {
    // try to specialize the error
    const msg = error?.message;
    if (response.status === 400 && isString(msg)) {
      throw new BadRequestError(msg, error);
    }

    throw new ApiError('Recevied error response', error);
  }

  const dataRaw = requireNotNull(data, 'checkResponse#data');

  const validatedData = schema.safeParse(dataRaw);

  if (!validatedData.success) {
    throw new ApiError('Invalid response', validatedData.error.format());
  }

  return validatedData.data;
}

export function checkRequest<T>(schema: Zod.ZodSchema<T>, request: T) {
  const parseResult = schema.safeParse(request);
  if (parseResult.success) {
    return parseResult.data;
  }

  throw new ApiError(`Invalid request: '${parseResult.error.format()}'`, parseResult.error);
}
