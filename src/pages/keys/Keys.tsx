import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { DrawerApi } from '@/components/Drawer';
import { Table } from '@/components/table/Table';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CreateKeyForm } from './CreateKeyForm';
import { KeyDetailsDisplay } from './KeyDetails';

export function Keys() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols lg:grid-cols-[60%_40%] pr-4">
      <KeysTable />
      <KeyDetailsDisplay />
    </div>
  );
}

function KeysTable() {
  const drawerApi = createRef<DrawerApi>();
  const [search, setSearch] = useSearchParams();
  const selectedKeyId = search.get('key');

  const { data: keys } = useSuspenseQuery({
    queryKey: ['keys'],
    queryFn: () => s3GarageClient.listAllKeys(),
  });

  function setSelectedKeyId(keyId: string | null) {
    if (keyId === null) {
      setSearch((search) => {
        search.delete('key');
        return search;
      });
    } else {
      setSearch({ key: keyId });
    }
  }
  return (
    <div>
      <CreateKeyForm drawerApi={drawerApi} />
      <Table.Root
        title="Keys"
        actions={
          <>
            <button
              className="btn btn-outline btn-xs"
              onClick={() => {
                drawerApi.current?.openDrawer();
              }}
            >
              ADD
            </button>
          </>
        }
      >
        <Table.Head>
          <Table.HeaderCell></Table.HeaderCell>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>Name</Table.HeaderCell>
        </Table.Head>
        <Table.Body>
          {keys.map((key) => {
            return (
              <Table.Row
                key={key.id}
                onSelected={() => {
                  const nextSelectedKeyId = selectedKeyId === key.id ? null : key.id;
                  return setSelectedKeyId(nextSelectedKeyId);
                }}
                isSelected={selectedKeyId === key.id}
              >
                <Table.HeaderCell>
                  <input type="checkbox" className="checkbox" checked={selectedKeyId === key.id} readOnly />
                </Table.HeaderCell>
                <Table.Cell>{key.id}</Table.Cell>
                <Table.Cell>{key.name}</Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </div>
  );
}
