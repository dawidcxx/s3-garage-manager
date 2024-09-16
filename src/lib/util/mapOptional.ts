import { isNil } from './isNil';

export type Optional<T> = T | null | undefined;

export function mapOptional<Input, Output>(
  item: Optional<Input>,
  operation: (item: Input) => Output,
): Output | null {
  if (isNil(item)) {
    return null;
  }
  return operation(item);
}
