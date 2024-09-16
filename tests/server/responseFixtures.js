export const HEALTH_RESPONSE = {
  status: 'healthy',
  knownNodes: 1,
  connectedNodes: 1,
  storageNodes: 1,
  storageNodesOk: 1,
  partitions: 256,
  partitionsQuorum: 256,
  partitionsAllOk: 256,
};

export const CLUSTER_STATUS_RESPONSE = {
  node: '02d07a515529334238970c669e03a19cf83d9a04447f84e128e9cb87bdab7629',
  garageVersion: 'v1.0.0',
  garageFeatures: [
    'k2v',
    'lmdb',
    'sqlite',
    'consul-discovery',
    'kubernetes-discovery',
    'metrics',
    'telemetry-otlp',
    'bundled-libs',
  ],
  rustVersion: '1.73.0',
  dbEngine: 'sqlite3 v3.45.0 (using rusqlite crate)',
  layoutVersion: 5,
  nodes: [
    {
      id: '02d07a515529334238970c669e03a19cf83d9a04447f84e128e9cb87bdab7629',
      role: {
        id: '02d07a515529334238970c669e03a19cf83d9a04447f84e128e9cb87bdab7629',
        zone: 'eu-central-1',
        capacity: 10073741824,
        tags: ['arm'],
      },
      addr: '127.0.0.1:3901',
      hostname: 'ubuntu-4gb-nbg1-2',
      isUp: true,
      lastSeenSecsAgo: null,
      draining: false,
      dataPartition: {
        available: 21796167680,
        total: 39973924864,
      },
      metadataPartition: {
        available: 21796167680,
        total: 39973924864,
      },
    },
  ],
};
