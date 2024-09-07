import { DrawerApi } from '@/lib/components/Drawer';
import { Title } from '@/lib/components/Title';
import { Ref, useRef } from 'react';
import { BucketCreateForm } from './BucketCreateForm';
import { useMutation, useQueries, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import { s3GarageClient } from '@/api/garage/s3-garage-client';

import { Table } from '@/lib/components/table/Table';
import { IconKey } from '@/lib/components/icons/IconKey';
import { IconCopy } from '@/lib/components/icons/IconCopy';
import { useWriteToClipBoard } from '@/lib/components/hooks/use-write-to-clipboard';
import { IconTrash } from '@/lib/components/icons/IconTrash';
import { ConfirmationModal, ModalApi } from '@/lib/components/ConfirmationModal';
import { BucketListItem } from '@/api/garage/s3-garage-client-responses';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { ToastType } from '@/lib/components/Toaster/Toast';
import { errorToMessage } from '@/lib/util/error-to-message';

export function Buckets() {
  const writeToClipboard = useWriteToClipBoard();
  const modalApi = useRef<ModalApi | null>(null);
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

      <ConfirmationModal modalId={'REMOVE_BUCKET_MODAL'} ref={modalApi}>
        <div className="flex flex-col gap-2">
          <span>Deletes a storage bucket. A bucket cannot be deleted if it is not empty.</span>
          <span>
            <strong>Warning: </strong> this will delete all aliases associated with the bucket!
          </span>
        </div>
      </ConfirmationModal>

      <Table.Root>
        <Table.Head>
          <Table.Cell />
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
                <Table.Cell>
                  <DeleteBucketButton bucket={bucket} modalApi={modalApi} />
                </Table.Cell>
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
                            <li className="p-4 flex flex-row gap-3 items-center justify-between">
                              <div className="flex flex-col">
                                <span className="font-semibold">Alias Name</span>
                                <span className="text-zinc-400">{localAlias.alias}</span>
                              </div>
                              <button
                                className="btn btn-xs btn-ghost btn-circle"
                                onClick={() => writeToClipboard('Access Key ID', localAlias.alias)}
                              >
                                <IconCopy />
                              </button>
                            </li>
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

function DeleteBucketButton(props: { modalApi: React.MutableRefObject<ModalApi | null>; bucket: BucketListItem }) {
  const { bucket, modalApi } = props;
  const { toast } = useToaster();
  const queryClient = useQueryClient();

  const removeBucketMutation = useMutation({
    mutationFn: (bucketId: string) => s3GarageClient.removeBucket(bucketId),
    onSuccess: () => {
      toast('Bucket deleted successfully', ToastType.Default);
      queryClient.invalidateQueries({ queryKey: ['buckets'] });
    },
    onError: (e) => {
      const msg = errorToMessage(e);
      toast(`Failed to delete bucket: ${msg}`, ToastType.Error);
    },
  });

  return (
    <button
      className="btn  btn-sm hover:btn-error"
      onClick={() => {
        modalApi.current?.open().then((isConfirmed) => {
          if (isConfirmed) {
            removeBucketMutation.mutate(bucket.id);
          }
        });
      }}
    >
      {removeBucketMutation.isPending && <div className="loading loading-sm" />}
      {!removeBucketMutation.isPending && <IconTrash />}
    </button>
  );
}
