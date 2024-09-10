export class ApiError extends Error {
  constructor(
    public description: string,
    public readonly cause: unknown,
  ) {
    super(`API Error: '${description}'`, { cause });
  }
}

export class InvalidReponse extends ApiError {
  constructor(
    public readonly message: string,
    public readonly serializedErrors: string,
  ) {
    super(`Invalid Response: '${message}'`, null);
  }
}

export class BadRequestError extends ApiError {
  constructor(
    public readonly message: string,
    public readonly cause: unknown,
  ) {
    super(`Bad Request: '${message}'`, cause);
  }
}

export class ForbiddenError extends ApiError {
  constructor(
    public readonly message: string,
    public readonly cause: unknown,
  ) {
    super(`Forbidden: '${message}'`, cause);
  }
}

export class AlreadyExistsError extends ApiError {
  constructor(
    public readonly message: string,
    public readonly cause: unknown,
  ) {
    super(`Already Exists: '${message}'`, cause);
  }
}

export class ServerError extends ApiError {
  constructor(
    public readonly message: string,
    public readonly cause: unknown,
  ) {
    super(`Server Error: '${message}'`, cause);
  }
}
