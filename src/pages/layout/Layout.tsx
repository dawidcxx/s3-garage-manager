import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { useSuspenseQuery } from '@tanstack/react-query';
import { CurrentRolesTable } from './CurrentRolesTable';
import { StagedRolesTable } from './StagedRolesTable';

export function Layout() {
  const { data: layoutDescription } = useSuspenseQuery({
    queryKey: ['layout'],
    queryFn: () => s3GarageClient.getCurrentLayout(),
  });

  return (
    <div className="flex flex-col gap-6">
      <CurrentRolesTable layoutDescription={layoutDescription} />
      <StagedRolesTable layoutDescription={layoutDescription} />
    </div>
  );
}
