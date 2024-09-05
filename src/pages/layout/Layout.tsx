import { IconCopy } from '@/components/icons/IconCopy';
import { IconCross } from '@/components/icons/IconCross';
import { LongId } from '@/components/LongId';
import { Table } from '@/components/table/Table';

export function Layout() {
  return (
    <div className="flex flex-col gap-6">
      <Table.Root title="roles" actions={<button className="btn btn-outline btn-xs ">ADD</button>}>
        <Table.Head>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Zone</Table.HeaderCell>
          <Table.HeaderCell>Capacity</Table.HeaderCell>
          <Table.HeaderCell>Tags</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          <Table.Row>
            <Table.Cell>
              <div className="flex flex-row gap-3">
                <button className="btn btn-square btn-xs btn-outline">
                  <IconEdit />
                </button>
                <button className="btn btn-square btn-xs btn-error btn-outline">
                  <IconCross />
                </button>
              </div>
            </Table.Cell>
            <Table.Cell>
              <div className="flex flex-row justify-start items-center gap-2">
                <LongId id="d6f8c3e5b2a1c4d8e9f7a6b5c3d2e1f0a9b8c7d6" className="flex-grow" />
                <button className="btn btn-circle btn-xs btn-ghost">
                  <IconCopy />
                </button>
              </div>
            </Table.Cell>
            <Table.Cell>eu-west-1</Table.Cell>
            <Table.Cell>8 GB</Table.Cell>
            <Table.Cell>
              <div className="flex flex-row gap-1">
                <div className="badge badge-neutral">arm</div>
                <div className="badge badge-neutral">highperf</div>
              </div>
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>

      <div className="flex flex-col ">
        <h5 className="text-lg mt-3 mb-2 ml-1 flex flex-row items-center gap-2">
          <span className="flex-grow">STAGED ROLES</span>
          <button className="btn btn-outline btn-xs hover:btn-error">DISCARD</button>
          <button className="btn btn-xs btn-primary ">APPLY</button>
        </h5>
        <div className="border border-dashed  p-4 flex flex-col gap-2" style={gradientBg}>
          <RoleStageEntry />
          <div className="divider" />
          <RoleStageEntry />
        </div>
      </div>
    </div>
  );
}

const gradientBg = {
  backgroundImage:
    'repeating-linear-gradient(45deg,var(--fallback-b1,oklch(var(--b1))),var(--fallback-b1,oklch(var(--b1))) 13px,var(--fallback-b2,oklch(var(--b2))) 13px,var(--fallback-b2,oklch(var(--b2))) 14px)',
};

function RoleStageEntry() {
  return (
    <div className="rounded-lg p-4 border border-slate-500 flex flex-col gap-3 ">
      <div className="flex flex-row items-center">
        <LongId id="d6f8c3e5b2a1c4d8e9f7a6b5c3d2e1f0a9b8c7d6" className="font-bold text-sm" />
        <div className="flex-grow"></div>
        <div className="badge badge-info">updated</div>
      </div>

      <table className="table">
        <thead className="border-b-2 border-b-slate-700">
          <tr>
            <th></th>
            <th>Zone</th>
            <th>Capacity</th>
            <th>Tags</th>
          </tr>
        </thead>
        <tbody>
          <tr className="cursor-pointer hover:bg-base-200">
            <th>after</th>
            <td>eu-west-1</td>
            <td>8 GB</td>
            <td>
              {' '}
              <div className="badge badge-neutral">arm</div> <div className="badge badge-neutral">highperf</div>{' '}
            </td>
          </tr>
          <tr className="cursor-pointer hover:bg-base-200">
            <th>before</th>
            <td>eu-west-1</td>
            <td>12 GB</td>
            <td>
              <div className="badge badge-neutral">arm</div>
            </td>
          </tr>
        </tbody>
      </table>
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
