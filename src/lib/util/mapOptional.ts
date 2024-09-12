import { isNil } from './isNil';

export type Optional<T> = T | null | undefined;

export function mapOptional<Input, Output>(
  item: Optional<Input>,
  operation: (item: Input) => Output,
): Optional<Output> {
  if (isNil(item)) {
    return item;
  }
  return operation(item);
}
