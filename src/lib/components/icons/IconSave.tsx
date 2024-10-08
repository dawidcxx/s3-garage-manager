import { IconProps } from './icons';

export function IconSave({ size = '1rem' }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" height={size} width={size}>
      <path fill="none" d="M0 0h24v24H0z" />
      <path d="M4 3h14l2.707 2.707a1 1 0 01.293.707V20a1 1 0 01-1 1H4a1 1 0 01-1-1V4a1 1 0 011-1zm3 1v5h9V4H7zm-1 8v7h12v-7H6zm7-7h2v3h-2V5z" />
    </svg>
  );
}
