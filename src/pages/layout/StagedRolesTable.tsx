import { LayoutDescription } from '@/api/garage/s3-garage-client-responses';
import { Table } from '@/lib/components/table/Table';
import { formatNumberToGBs } from '@/lib/util/format-number-to-GBs';
import { RoleTags } from './RoleTags';
import { requireNotNull } from '@/lib/util/require-not-null';
import clsx from 'clsx';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { ToastType } from '@/lib/components/Toaster/Toast';
import { errorToMessage } from '@/lib/util/error-to-message';
import { ConfirmationModal, ModalApi } from '@/lib/components/ConfirmationModal';
import { useRef } from 'react';

export function StagedRolesTable(props: { layoutDescription: LayoutDescription }) {
  const { toast } = useToaster();
  const queryClient = useQueryClient();
  const discardLayoutMutation = useMutation({
    mutationFn: (nextLayoutVersion: number) => s3GarageClient.discardLayout(nextLayoutVersion),
    onSuccess: () => {
      toast(<div>Layout changes discarded</div>);
      queryClient.invalidateQueries({ queryKey: ['layout'] });
    },
    onError: (e) => {
      const errorMessage = errorToMessage(e);
      toast(<div>Failed to discard layout changes: {errorMessage}</div>, ToastType.Error);
    },
  });

  const applyLayoutMutation = useMutation({
    mutationFn: (nextLayoutVersion: number) => s3GarageClient.applyLayout(nextLayoutVersion),
    onSuccess: () => {
      toast(<div>Layout changes applied</div>);
      queryClient.invalidateQueries({ queryKey: ['layout'] });
    },
    onError: (e) => {
      const errorMessage = errorToMessage(e);
      toast(<div>Failed to apply layout changes: {errorMessage}</div>, ToastType.Error);
    },
  });
  const confirmStagedRolesActionModal = useRef<ModalApi | null>(null);

  const { layoutDescription } = props;
  const { addedRoles, removedRoes, updatedRoles } = mapRoleChanges(layoutDescription);
  const hasAnyStagedChanges = layoutDescription.stagedRoleChanges.length > 0;

  return (
    <div className="flex flex-col ">
      <ConfirmationModal modalId={'CONFIRM_STAGED_ROLE_ACTION'} ref={confirmStagedRolesActionModal}>
        Confirming will apply all the currently staged role changes, this action cannot be undone.
      </ConfirmationModal>
      <h5 className="text-lg mt-3 mb-2 ml-1 flex flex-row items-center gap-2">
        <span className="flex-grow">STAGED ROLES</span>
        <button
          className="btn btn-outline btn-xs hover:btn-error"
          disabled={!hasAnyStagedChanges || discardLayoutMutation.isPending}
          onClick={() => {
            discardLayoutMutation.mutate(layoutDescription.version + 1);
          }}
        >
          DISCARD
        </button>
        <button
          className="btn btn-xs btn-primary"
          disabled={!hasAnyStagedChanges || applyLayoutMutation.isPending}
          onClick={() => {
            confirmStagedRolesActionModal.current?.open().then((confirmed) => {
              if (confirmed) {
                applyLayoutMutation.mutate(layoutDescription.version + 1);
              }
            });
          }}
        >
          APPLY
        </button>
      </h5>
      <div
        className={clsx('border border-dashed  p-4 flex flex-col gap-2', { 'border-gray-500': !hasAnyStagedChanges })}
        style={gradientBg}
      >
        {addedRoles.map((stagedRole) => (
          <RoleStageEntry key={stagedRole.role.id} stagedRole={stagedRole} />
        ))}
        {removedRoes.map((stagedRole) => (
          <RoleStageEntry key={stagedRole.role.id} stagedRole={stagedRole} />
        ))}
        {updatedRoles.map((stagedRole) => (
          <RoleStageEntry key={stagedRole.before.id} stagedRole={stagedRole} />
        ))}
        {!hasAnyStagedChanges && (
          <span className="text-center text-lg tracking-widest uppercase text-gray-500 ">No staged role changes</span>
        )}
      </div>
    </div>
  );
}

const gradientBg = {
  backgroundImage:
    'repeating-linear-gradient(45deg,var(--fallback-b1,oklch(var(--b1))),var(--fallback-b1,oklch(var(--b1))) 13px,var(--fallback-b2,oklch(var(--b2))) 13px,var(--fallback-b2,oklch(var(--b2))) 14px)',
};

type Role = LayoutDescription['roles'][0];

interface StagedRoleDeleted {
  type: 'deleted';
  role: Role;
}

interface StagedRoleAdded {
  type: 'added';
  role: Role;
}

interface StagedRoleUpdated {
  type: 'updated';
  before: Role;
  after: Role;
}

type StagedRole = StagedRoleDeleted | StagedRoleAdded | StagedRoleUpdated;

function RoleStageEntry(props: { stagedRole: StagedRole }) {
  const { stagedRole } = props;

  switch (stagedRole.type) {
    case 'added':
      return (
        <RoleStageLayout badge={<div className="badge badge-success">Added</div>} roleId={stagedRole.role.id}>
          <Table.Root>
            <Table.Head>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Zone</Table.HeaderCell>
              <Table.HeaderCell>Capacity</Table.HeaderCell>
              <Table.HeaderCell>Tags</Table.HeaderCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{stagedRole.role.id}</Table.Cell>
                <Table.Cell>{stagedRole.role.zone}</Table.Cell>
                <Table.Cell>{formatNumberToGBs(stagedRole.role.capacity)}</Table.Cell>
                <Table.Cell>
                  <RoleTags tags={stagedRole.role.tags} />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </RoleStageLayout>
      );
    case 'deleted':
      return (
        <RoleStageLayout badge={<div className="badge badge-error">Removed</div>} roleId={stagedRole.role.id}>
          <Table.Root>
            <Table.Head>
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Zone</Table.HeaderCell>
              <Table.HeaderCell>Capacity</Table.HeaderCell>
              <Table.HeaderCell>Tags</Table.HeaderCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>{stagedRole.role.id}</Table.Cell>
                <Table.Cell>{stagedRole.role.zone}</Table.Cell>
                <Table.Cell>{formatNumberToGBs(stagedRole.role.capacity)}</Table.Cell>
                <Table.Cell>
                  <RoleTags tags={stagedRole.role.tags} />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </RoleStageLayout>
      );
    case 'updated':
      return (
        <RoleStageLayout badge={<div className="badge badge-accent">Updated</div>} roleId={stagedRole.before.id}>
          <Table.Root>
            <Table.Head>
              <Table.HeaderCell />
              <Table.HeaderCell>ID</Table.HeaderCell>
              <Table.HeaderCell>Zone</Table.HeaderCell>
              <Table.HeaderCell>Capacity</Table.HeaderCell>
              <Table.HeaderCell>Tags</Table.HeaderCell>
            </Table.Head>
            <Table.Body>
              <Table.Row>
                <Table.Cell>before</Table.Cell>
                <Table.Cell>{stagedRole.before.id}</Table.Cell>
                <Table.Cell>{stagedRole.before.zone}</Table.Cell>
                <Table.Cell>{formatNumberToGBs(stagedRole.before.capacity)}</Table.Cell>
                <Table.Cell>
                  <RoleTags tags={stagedRole.before.tags} />
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>after</Table.Cell>
                <Table.Cell>{stagedRole.after.id}</Table.Cell>
                <Table.Cell>{stagedRole.after.zone}</Table.Cell>
                <Table.Cell>{formatNumberToGBs(stagedRole.after.capacity)}</Table.Cell>
                <Table.Cell>
                  <RoleTags tags={stagedRole.after.tags} />
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table.Root>
        </RoleStageLayout>
      );
  }
}

function RoleStageLayout(props: { roleId: string; children: React.ReactNode; badge: React.ReactNode }) {
  const { roleId, badge, children } = props;
  return (
    <div className="rounded-lg p-4 border border-slate-500 flex flex-col gap-3 ">
      <div className="flex flex-row items-center">
        <span className="font-semibold tracking-wide pl-1"># {roleId.slice(0, 10)}</span>
        <div className="flex-grow"></div>
        {badge}
      </div>
      {children}
    </div>
  );
}

function mapRoleChanges(layoutDescription: LayoutDescription) {
  const currentRolesSet = new Set(layoutDescription.roles.map((role) => role.id));

  const removedRoes: StagedRoleDeleted[] = [];
  const addedRoles: StagedRoleAdded[] = [];
  const updatedRoles: StagedRoleUpdated[] = [];

  for (const stagedRole of layoutDescription.stagedRoleChanges) {
    if (stagedRole.remove === true) {
      const role = layoutDescription.roles.find((role) => role.id === stagedRole.id);
      removedRoes.push({ type: 'deleted', role: requireNotNull(role, 'role') });
      continue;
    }

    const role = {
      id: stagedRole.id,
      zone: requireNotNull(stagedRole.zone, 'zone'),
      capacity: requireNotNull(stagedRole.capacity, 'capacity'),
      tags: stagedRole.tags ?? [],
    };

    if (currentRolesSet.has(stagedRole.id)) {
      const currentRole = requireNotNull(
        layoutDescription.roles.find((role) => role.id === stagedRole.id),
        'currentRole',
      );
      updatedRoles.push({ type: 'updated', before: currentRole, after: role });
      continue;
    }

    addedRoles.push({ type: 'added', role });
  }

  return { removedRoes, addedRoles, updatedRoles };
}
