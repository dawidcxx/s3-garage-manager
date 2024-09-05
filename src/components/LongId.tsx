export interface LongIdProps {
  id: string;
  className?: string;
}

export function LongId({ id, className }: LongIdProps) {
  return (
    <div className={className}>
      <div className="hidden xl:inline-block">{id}</div>
      <div className="xl:hidden">{shortenId(id)}</div>
    </div>
  );
}

function shortenId(id: string) {
  return id.slice(0, 10);
}
