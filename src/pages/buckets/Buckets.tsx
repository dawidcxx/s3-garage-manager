import { DrawerApi } from '@/components/Drawer';
import { Title } from '@/components/Title';
import { useRef } from 'react';
import { BucketCreateForm } from './BucketCreateForm';
import { useSuspenseQuery } from '@tanstack/react-query';
import { s3GarageClient } from '@/api/garage/s3-garage-client';

import { Table } from '@/components/table/Table';
import { IconKey } from '@/components/icons/IconKey';
import { IconCopy } from '@/components/icons/IconCopy';
import { useWriteToClipBoard } from '@/components/hooks/use-write-to-clipboard';

export function Buckets() {
  const writeToClipboard = useWriteToClipBoard();
  const bucketsRef = useRef<HTMLDivElement | null>(null);
  const drawerApi = useRef<DrawerApi | null>(null);

  const { data } = useSuspenseQuery({
    queryKey: ['buckets'],
    queryFn: () => s3GarageClient.listAllBuckets(),
  });

  return (
    <div className="">
      <Title className="max-w-screen-2xl">
        <div className="flex flex-row items-center gap-3">
          Buckets
          <button
            className="btn btn-outline btn-xs btn-primary"
            onClick={() => {
              drawerApi.current?.openDrawer();
            }}
          >
            ADD
          </button>
        </div>
      </Title>
      <BucketCreateForm drawerApi={drawerApi} />

      <Table.Root>
        <Table.Head>
          <Table.Cell>ID</Table.Cell>
          <Table.Cell>Global Aliases</Table.Cell>
          <Table.Cell>Local Aliases</Table.Cell>
        </Table.Head>
        <Table.Body>
          {data.map((bucket) => {
            const hasGlobalAliases = bucket.globalAliases.length > 0;
            const hasLocalAliases = bucket.localAliases.length > 0;
            return (
              <Table.Row key={bucket.id}>
                <Table.Cell>{bucket.id}</Table.Cell>
                <Table.Cell>
                  {bucket.globalAliases.map((globalAlias) => {
                    return (
                      <div key={globalAlias} className="badge badge-neutral">
                        {globalAlias}
                      </div>
                    );
                  })}
                  {!hasGlobalAliases && <div className="text-gray-500">None</div>}
                </Table.Cell>
                <Table.Cell>
                  {!hasLocalAliases && <div className="text-gray-500">None</div>}
                  <div className="flex flex-col gap-2">
                    {bucket.localAliases.map((localAlias) => {
                      return (
                        <div className="dropdown dropdown-end" key={localAlias.accessKeyId}>
                          <div tabIndex={0} role="button" className="btn btn-xs btn-outline rounded-md">
                            <IconKey size={'1em'} /> {localAlias.alias}
                          </div>
                          <ul tabIndex={0} className="dropdown-content bg-base-300 rounded-lg z-[1] shadow">
                            <li className="p-4 flex flex-row gap-3 items-center">
                              <div className="flex flex-col">
                                <span className="font-semibold">Access Key ID</span>
                                <span className="text-zinc-400">{localAlias.accessKeyId}</span>
                              </div>
                              <button
                                className="btn btn-xs btn-ghost btn-circle"
                                onClick={() => writeToClipboard('Access Key ID', localAlias.accessKeyId)}
                              >
                                <IconCopy />
                              </button>
                            </li>
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
