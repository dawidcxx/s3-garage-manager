export function uniq<Item extends string | number>(items: Item[]): Item[] {
  return Array.from(new Set(items));
}