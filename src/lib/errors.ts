export class ApiError extends Error {
  constructor(
    public description: string,
    public readonly cause: unknown,
  ) {
    super(`API Error: '${description}'`, { cause });
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

export class AlreadyExistsError extends ApiError {
  constructor(
    public readonly message: string,
    public readonly cause: unknown,
  ) {
    super(`Already Exists: '${message}'`, cause);
  }
}