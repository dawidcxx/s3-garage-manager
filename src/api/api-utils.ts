import {
  AlreadyExistsError,
  ApiError,
  BadRequestError,
  ForbiddenError,
  InvalidReponse,
  ServerError,
} from '@/lib/errors';
import { requireNotNull } from '@/lib/util/require-not-null';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function checkResponse<T>(schema: Zod.ZodSchema<T>, response: Response): Promise<T> {
  let body: T | null = null;
  try {
    body = (await response.json()) as T;
  } catch {
    throw new InvalidReponse('Invalid response', 'Response body is not a valid JSON');
  }

  if (!response.ok) {
    const asStandardErrorResponse = StandardErrorResponseSchema.safeParse(body);

    if (asStandardErrorResponse.success) {
      if (response.status === 400) {
        throw new BadRequestError(asStandardErrorResponse.data.message, asStandardErrorResponse.data);
      }

      if (response.status === 403) {
        throw new ForbiddenError(asStandardErrorResponse.data.message, asStandardErrorResponse.data);
      }

      if (response.status === 409) {
        throw new AlreadyExistsError(asStandardErrorResponse.data.message, asStandardErrorResponse.data);
      }

      if (response.status > 500) {
        throw new ServerError('Server error', asStandardErrorResponse.data);
      }

      throw new ApiError(asStandardErrorResponse.data.message, asStandardErrorResponse.data);
    } else {
      throw new ApiError('Recevied unknown error response', { body, status: response.status });
    }
  }

  const dataRaw = requireNotNull(body, 'checkResponse#body');
  const validatedData = schema.safeParse(dataRaw);

  if (!validatedData.success) {
    throw new InvalidReponse('Invalid response', JSON.stringify(validatedData.error.errors, null, 2));
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

const StandardErrorResponseSchema = z.object({
  message: z.string(),
});
