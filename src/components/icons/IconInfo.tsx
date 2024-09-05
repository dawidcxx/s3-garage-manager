import { IconProps } from './icons';

export function IconInfo({ size = '1rem' }: IconProps) {
  return (
    <svg fill="none" viewBox="0 0 24 24" height={size} width={size}>
      <path fill="currentColor" d="M11 10.98a1 1 0 112 0v6a1 1 0 11-2 0v-6zM12 6.051a1 1 0 100 2 1 1 0 000-2z" />
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zM4 12a8 8 0 1016 0 8 8 0 00-16 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}
