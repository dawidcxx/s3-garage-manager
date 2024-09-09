import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { useSuspenseQueries } from '@tanstack/react-query';
import { CurrentRolesTable } from './CurrentRolesTable';
import { StagedRolesTable } from './StagedRolesTable';

export function Layout() {
  const [{ data: layoutDescription }, { data: clusterDetails }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['layout'],
        queryFn: () => s3GarageClient.getCurrentLayout(),
      },
      {
        queryKey: ['clusterDetails'],
        queryFn: () => s3GarageClient.getClusterDetails(),
      },
    ],
  });

  return (
    <div className="flex flex-col gap-6">
      <CurrentRolesTable layoutDescription={layoutDescription} clusterDetails={clusterDetails} />
      <StagedRolesTable layoutDescription={layoutDescription} />
    </div>
  );
}
