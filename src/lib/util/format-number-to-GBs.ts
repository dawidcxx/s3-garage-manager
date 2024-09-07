export function formatNumberToGBs(numberInBytes: number) {
  return `${(numberInBytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
}
