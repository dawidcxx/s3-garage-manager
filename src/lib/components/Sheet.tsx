import clsx from 'clsx';

export interface SheetProps {
  children?: React.ReactNode;
  className?: string;
}

function Root({ children, className }: SheetProps) {
  return (
    <div className={clsx(' p-4 rounded-lg flex flex-row  shadow-md bg-zinc-900 mt-12', className)}>{children}</div>
  );
}

export interface SheetTitleProps {
  children?: React.ReactNode;
  className?: string;
}

function Title({ children, className }: SheetTitleProps) {
  return <h5 className={clsx('text-lg font-bold', className)}>{children}</h5>;
}

export const Sheet = { Root, Title };
