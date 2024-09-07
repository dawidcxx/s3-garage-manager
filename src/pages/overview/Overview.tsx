import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { ClusterDetails, HealthReportResponse } from '@/api/garage/s3-garage-client-responses';
import { IconCheck } from '@/lib/components/icons/IconCheck';
import { IconCross } from '@/lib/components/icons/IconCross';
import { Table } from '@/lib/components/table/Table';
import { formatNumberToGBs } from '@/lib/util/format-number-to-GBs';
import { isNil } from '@/lib/util/isNil';
import { useSuspenseQueries } from '@tanstack/react-query';
import clsx from 'clsx';

export function Overview() {
  const [{ data: healthReport }, { data: clusterDetails }] = useSuspenseQueries({
    queries: [
      {
        queryKey: ['healthReport'],
        queryFn: () => s3GarageClient.getHealthCheckReport(),
      },
      {
        queryKey: ['clusterDetails'],
        queryFn: () => s3GarageClient.getClusterDetails(),
      },
    ],
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="grid lg:grid-cols-2 gap-2">
        <OverviewStat
          metricName="status"
          metricValue={
            <div
              className={clsx({
                'text-emerald-500': healthReport.status === 'healthy',
                'text-yellow-500': healthReport.status === 'degraded',
                'text-red-500': healthReport.status === 'unavailable',
              })}
            >
              {healthReport.status}
            </div>
          }
          metricSecondary={healhReportStatusToDescription(healthReport.status)}
          metricIcon={<IconClipboardPulse />}
        />
        <OverviewStat
          metricName="garage version"
          metricValue={<div className="tracking-widest">{clusterDetails.garageVersion}</div>}
          metricSecondary={`Rust @ ${clusterDetails.rustVersion}`}
          metricIcon={<IconInfoCircle />}
        />
        <OverviewStat
          metricName="Storage Nodes"
          metricValue={
            <div className="tracking-widest">
              {healthReport.storageNodes} / {healthReport.storageNodesOk}
            </div>
          }
          metricSecondary="connected / total"
          metricIcon={<IconCircleNodes />}
        />
        <OverviewStat
          metricName="Partitions"
          metricValue={
            <div className="tracking-widest">
              {' '}
              {healthReport.partitionsAllOk} / {healthReport.partitions}{' '}
            </div>
          }
          metricSecondary="partitions ok / total"
          metricIcon={<IconHarddisk />}
        />
      </div>
      <OverviewNodesTable clusterDetails={clusterDetails} />
    </div>
  );
}

interface OverviewProps {
  metricName: React.ReactNode;
  metricValue: React.ReactNode;
  metricSecondary?: React.ReactNode;
  metricIcon?: React.ReactNode;
}

export function OverviewStat({ metricName, metricSecondary, metricValue, metricIcon }: OverviewProps) {
  return (
    <div className="inline-block">
      <div className=" p-4 rounded-lg flex flex-row  shadow-md bg-zinc-900">
        <div className="flex flex-col flex-grow mr-12">
          <div className=" text-sm lowercase mb-1 tracking-wide font-semibold">{metricName}</div>
          <div className="text-primary text-xl tracking-wide uppercase font-bold">{metricValue}</div>
          <div className="text-xs text-slate-500">{metricSecondary}</div>
        </div>
        <div className="flex flex-col justify-center items-center pt-1">{metricIcon}</div>
      </div>
    </div>
  );
}

function IconClipboardPulse() {
  return (
    <div className="relative">
      <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-400 opacity-75" />
      <svg fill="currentColor" viewBox="0 0 16 16" height="2rem" width="2rem">
        <path
          fillRule="evenodd"
          d="M10 1.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h3a.5.5 0 00.5-.5v-1zm-5 0A1.5 1.5 0 016.5 0h3A1.5 1.5 0 0111 1.5v1A1.5 1.5 0 019.5 4h-3A1.5 1.5 0 015 2.5v-1zm-2 0h1v1H3a1 1 0 00-1 1V14a1 1 0 001 1h10a1 1 0 001-1V3.5a1 1 0 00-1-1h-1v-1h1a2 2 0 012 2V14a2 2 0 01-2 2H3a2 2 0 01-2-2V3.5a2 2 0 012-2zm6.979 3.856a.5.5 0 00-.968.04L7.92 10.49l-.94-3.135a.5.5 0 00-.895-.133L4.232 10H3.5a.5.5 0 000 1h1a.5.5 0 00.416-.223l1.41-2.115 1.195 3.982a.5.5 0 00.968-.04L9.58 7.51l.94 3.135A.5.5 0 0011 11h1.5a.5.5 0 000-1h-1.128L9.979 5.356z"
        />
      </svg>
    </div>
  );
}

function OverviewNodesTable(props: { clusterDetails: ClusterDetails }) {
  const { clusterDetails } = props;
  return (
    <Table.Root title="nodes">
      <Table.Head>
        <Table.HeaderCell>ID</Table.HeaderCell>
        <Table.HeaderCell>Address</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
        <Table.HeaderCell>Last Seen</Table.HeaderCell>
        <Table.HeaderCell>Hostname</Table.HeaderCell>
        <Table.HeaderCell>Available</Table.HeaderCell>
        <Table.HeaderCell>Total</Table.HeaderCell>
      </Table.Head>
      <Table.Body>
        {clusterDetails.nodes.map((node) => {
          return (
            <Table.Row key={node.id}>
              <Table.Cell className="flex flex-row justify-between">{node.id}</Table.Cell>
              <Table.Cell>{node.addr}</Table.Cell>
              <Table.Cell>{node.isUp ? <IconCheck /> : <IconCross />}</Table.Cell>
              <Table.Cell>{isNil(node.lastSeenSecsAgo) ? '-' : `< ${node.lastSeenSecsAgo} seconds ago`}</Table.Cell>
              <Table.Cell>{node.hostname}</Table.Cell>
              <Table.Cell>{formatNumberToGBs(node.dataPartition.available)}</Table.Cell>
              <Table.Cell>{formatNumberToGBs(node.dataPartition.total)}</Table.Cell>
            </Table.Row>
          );
        })}
      </Table.Body>
    </Table.Root>
  );
}

function IconCircleNodes() {
  return (
    <svg viewBox="0 0 512 512" fill="currentColor" height="2rem" width="2rem">
      <path d="M418.4 157.9c35.3-8.3 61.6-40 61.6-77.9 0-44.2-35.8-80-80-80-43.4 0-78.7 34.5-80 77.5l-183.8 73.6C121.7 136.8 101.9 128 80 128c-44.2 0-80 35.8-80 80s35.8 80 80 80c12.2 0 23.8-2.7 34.1-7.6l145.6 127.4c-2.4 7.6-3.7 15.8-3.7 24.2 0 44.2 35.8 80 80 80s80-35.8 80-80c0-27.7-14-52.1-35.4-66.4l37.8-207.7zm-262.1 74.3c2.2-6.9 3.5-14.2 3.7-21.7L343.8 137c3.6 3.5 7.4 6.7 11.6 9.5l-37.8 207.6c-5.5 1.3-10.8 3.1-15.8 5.5L156.3 232.2z" />
    </svg>
  );
}

function IconHarddisk() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" height="2rem" width="2rem">
      <path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2m6 2a6 6 0 00-6 6c0 3.31 2.69 6 6.1 6l-.88-2.23a1.01 1.01 0 01.37-1.37l.86-.5a1.01 1.01 0 011.37.37l1.92 2.42A5.977 5.977 0 0018 10a6 6 0 00-6-6m0 5a1 1 0 011 1 1 1 0 01-1 1 1 1 0 01-1-1 1 1 0 011-1m-5 9a1 1 0 00-1 1 1 1 0 001 1 1 1 0 001-1 1 1 0 00-1-1m5.09-4.73l2.49 6.31 2.59-1.5-4.22-5.31-.86.5z" />
    </svg>
  );
}

function IconInfoCircle() {
  return (
    <svg viewBox="0 0 1024 1024" fill="currentColor" height="2rem" width="2rem">
      <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
      <path d="M464 336a48 48 0 1096 0 48 48 0 10-96 0zm72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8z" />
    </svg>
  );
}

function healhReportStatusToDescription(status: HealthReportResponse['status']) {
  switch (status) {
    case 'healthy':
      return 'All systems are operational';
    case 'degraded':
      return 'Some systems are experiencing issues';
    case 'unavailable':
      return 'The system is currently unavailable';
  }
}
