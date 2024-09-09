import { ClusterDetails, LayoutDescription } from '@/api/garage/s3-garage-client-responses';
import { IconCopy } from '@/lib/components/icons/IconCopy';
import { IconCross } from '@/lib/components/icons/IconCross';
import { Table } from '@/lib/components/table/Table';
import { formatNumberToGBs } from '@/lib/util/format-number-to-GBs';
import { RoleTags } from './RoleTags';
import { AddRoleForm } from './AddRoleForm';
import { DrawerApi } from '@/lib/components/Drawer';
import { useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { errorToMessage } from '@/lib/util/error-to-message';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { ToastType } from '@/lib/components/Toaster/Toast';

export function CurrentRolesTable(props: { layoutDescription: LayoutDescription; clusterDetails: ClusterDetails }) {
  const { layoutDescription, clusterDetails } = props;

  const drawerRef = useRef<DrawerApi | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToaster();

  const removeRoleMutation = useMutation({
    mutationFn: (roleId: string) => s3GarageClient.removeLayoutNode([{ id: roleId, remove: true }]),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['layout'] });
    },
    onError: (e) => {
      const msg = errorToMessage(e);
      toast(<div>Failed to stage role removal: '{msg}'</div>, ToastType.Error);
    },
  });

  return (
    <div>
      <AddRoleForm drawerApi={drawerRef} clusterDetails={clusterDetails} />
      <Table.Root
        title={
          <div>
            roles <span className="text-slate-500 text-xs ml-1 lowercase">v{layoutDescription.version}</span>
          </div>
        }
        actions={
          <button
            className="btn btn-outline btn-xs"
            onClick={() => {
              drawerRef.current?.openDrawer();
            }}
          >
            ADD
          </button>
        }
      >
        <Table.Head>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Zone</Table.HeaderCell>
          <Table.HeaderCell>Capacity</Table.HeaderCell>
          <Table.HeaderCell>Tags</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          {layoutDescription.roles.map((role) => {
            return (
              <Table.Row key={role.id}>
                <Table.Cell>
                  <div className="flex flex-row gap-3">
                    <button className="btn btn-square btn-xs btn-outline" disabled>
                      <IconEdit />
                    </button>
                    <button
                      className="btn btn-square btn-xs btn-error btn-outline"
                      disabled={removeRoleMutation.isPending}
                      onClick={() => {
                        removeRoleMutation.mutate(role.id);
                      }}
                    >
                      <IconCross />
                    </button>
                  </div>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex flex-row justify-start items-center gap-2">
                    <span>{role.id}</span>
                    <button className="btn btn-circle btn-xs btn-ghost">
                      <IconCopy />
                    </button>
                  </div>
                </Table.Cell>
                <Table.Cell>{role.zone}</Table.Cell>
                <Table.Cell>{formatNumberToGBs(role.capacity)}</Table.Cell>
                <Table.Cell>
                  <RoleTags tags={role.tags} />
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
}

function IconEdit() {
  return (
    <svg viewBox="0 0 1024 1024" fill="currentColor" height="1em" width="1em">
      <path d="M880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32zm-622.3-84c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 000-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 009.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9z" />
    </svg>
  );
}
