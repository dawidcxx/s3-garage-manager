import clsx from 'clsx';

interface TitleProps {
  children?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function Title({ children, actions, className }: TitleProps) {
  return (
    <h5 className={clsx('text-lg mt-3 mb-2 ml-1 flex flex-row items-start gap-2', className)}>
      <span className="flex-grow uppercase">{children}</span>
      <span>{actions}</span>
    </h5>
  );
}
