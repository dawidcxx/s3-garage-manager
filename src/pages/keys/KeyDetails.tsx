import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { KeyDetails } from '@/api/garage/s3-garage-client-responses';
import { useWriteToClipBoard } from '@/components/hooks/use-write-to-clipboard';
import { IconCopy } from '@/components/icons/IconCopy';
import { ConfirmationModal, ModalApi } from '@/components/Modal';
import { Sheet } from '@/components/Sheet';
import { Table } from '@/components/table/Table';
import { ToastType } from '@/components/Toaster/Toast';
import { useToaster } from '@/components/Toaster/useToaster';
import { errorToMessage } from '@/lib/util/error-to-message';
import { isNil } from '@/lib/util/isNil';
import { requireNotNull } from '@/lib/util/require-not-null';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import React from 'react';
import { useRef } from 'react';
import {  useNavigate, useSearchParams } from 'react-router-dom';

export function KeyDetailsDisplay() {
  const [search] = useSearchParams();
  const selectedKeyId = search.get('key');

  return (
    <Sheet.Root className="flex flex-col max-w-xl self-baseline">
      <React.Suspense fallback="loading...">
        {isNil(selectedKeyId) && 'Select a Key to view details'}
        {selectedKeyId && <SelectedKeyDetailsDisplay selectedKeyId={selectedKeyId} />}
      </React.Suspense>
    </Sheet.Root>
  );
}

function SelectedKeyDetailsDisplay({ selectedKeyId }: { selectedKeyId: string }) {
  const writeToClipboard = useWriteToClipBoard();
  const { data: selectedKey } = useSuspenseQuery({
    queryKey: ['key', selectedKeyId],
    queryFn: () => s3GarageClient.getKeyDetails(selectedKeyId),
  });
  const hasBuckets = selectedKey.buckets.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4 mt-4">
        <KeyValue name="ID">{selectedKey.accessKeyId}</KeyValue>
        <KeyValue name="Name">{selectedKey.name}</KeyValue>
        <KeyValue name="Secret Key">
          <label className="input input-bordered input-xs input-disabled flex items-center gap-2">
            <input type="password" disabled className="grow" value={selectedKey.secretAccessKey} autoComplete="off" />
            <button
              className="btn btn-ghost btn-circle btn-xs"
              onClick={() => writeToClipboard('Secret Key', selectedKey.secretAccessKey)}
            >
              <IconCopy />
            </button>
          </label>
        </KeyValue>
        <KeyValue name="Can Create Buckets">
          <input type="checkbox" className="checkbox" checked={selectedKey.permissions.createBucket} readOnly />
        </KeyValue>
        <KeyValue name="Buckets">{hasBuckets ? selectedKey.buckets.length : '-'}</KeyValue>
        {hasBuckets && (
          <Table.Root>
            <Table.Head>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Read</Table.HeaderCell>
              <Table.HeaderCell>Write</Table.HeaderCell>
              <Table.HeaderCell>Owner</Table.HeaderCell>
            </Table.Head>
            <Table.Body>
              {selectedKey.buckets.map((bucket) => {
                const bucketName = bucket.globalAliases[0] ? bucket.globalAliases[0] : bucket.localAliases[0];

                return (
                  <Table.Row key={bucket.id}>
                    <Table.Cell>{bucketName}</Table.Cell>
                    <Table.Cell>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        readOnly
                        checked={bucket.permissions.read}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        readOnly
                        checked={bucket.permissions.write}
                      />
                    </Table.Cell>
                    <Table.Cell>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs"
                        readOnly
                        checked={bucket.permissions.owner}
                      />
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table.Root>
        )}
      </div>
      <div className="divider" />
      <SelectedKeyDetailsActions keyDetails={selectedKey} />
    </div>
  );
}

function SelectedKeyDetailsActions(props: { keyDetails: KeyDetails }) {
  const navigate = useNavigate();
  const { keyDetails } = props;
  const { toast } = useToaster();
  const modalRef = useRef<ModalApi | null>(null);

  const queryClient = useQueryClient();

  const removeKeyMutation = useMutation({
    mutationFn: () => s3GarageClient.removeKey(props.keyDetails.accessKeyId),
    onError(error) {
      const msg = errorToMessage(error);
      toast(`Error while removing key: '${msg}'`, ToastType.Error);
    },
    async onSuccess() {
      toast(`Key: '${keyDetails.name}' has been removed successfully`);
      await queryClient.invalidateQueries({ queryKey: ['keys'] });
      navigate('/keys');
    },
  });

  async function onRemoveKeyRequest() {
    const modal = requireNotNull(modalRef.current, 'modalRef.current');
    const confirmed = await modal.open();
    if (confirmed) {
      await removeKeyMutation.mutateAsync();
    }
  }

  return (
    <div className="flex flex-row justify-end">
      <ConfirmationModal modalId={'REMOVE_KEY_MODAL'} ref={modalRef} />
      <button
        disabled={removeKeyMutation.isPending}
        className="btn btn-outline btn-xs hover:btn-error"
        onClick={onRemoveKeyRequest}
      >
        {removeKeyMutation.isPending && <span className="loading loading-spinner w-4 h-4"></span>}
        REMOVE KEY
      </button>
    </div>
  );
}

interface KeyValueProps {
  name?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

function KeyValue({ name: keyName, children, className }: KeyValueProps) {
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="text-gray-500">{keyName}:</div>
      <div className={clsx('font-bold', className)}>{children}</div>
    </div>
  );
}
