export function requireNotNull<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) {
    throw new Error(`requireNotNull check failed: '${message}'`);
  }
  return value;
}
