import { access } from 'fs';
import { permission } from 'process';
import { z } from 'zod';

export const BucketListItemSchema = z.object({
  id: z.string(),
  globalAliases: z.array(z.string()),
  localAliases: z.array(
    z.object({
      alias: z.string(),
      accessKeyId: z.string(),
    }),
  ),
});

export type BucketListItem = z.infer<typeof BucketListItemSchema>;

export const BucketListItemsSchema = z.array(BucketListItemSchema);

export const CreateBucketResponseSchema = z.object({
  id: z.string(),
  globalAliases: z.array(z.string()),
  websiteAccess: z.boolean(),
});

export const KeyListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});
export type KeyListItem = z.infer<typeof KeyListItemSchema>;
export const KeyListItemsSchema = z.array(KeyListItemSchema);

export const KeyDetailsSchema = z.object({
  name: z.string(),
  accessKeyId: z.string(),
  permissions: z.object({
    createBucket: z.boolean(),
  }),
  buckets: z.array(
    z.object({
      id: z.string(),
      globalAliases: z.array(z.string()),
      localAliases: z.array(z.string()),
      permissions: z.object({
        read: z.boolean(),
        write: z.boolean(),
        owner: z.boolean(),
      }),
    }),
  ),
  secretAccessKey: z.string(),
});

export type KeyDetails = z.infer<typeof KeyDetailsSchema>;

export const CreatedKeySchema = z.object({
  name: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
});

export type CreatedKey = z.infer<typeof CreatedKeySchema>;

export const HealthReportResponseSchema = z.object({
  status: z.union([z.literal('healthy'), z.literal('degraded'), z.literal('unavailable')]),
  knownNodes: z.number(),
  connectedNodes: z.number(),
  storageNodes: z.number(),
  storageNodesOk: z.number(),
  partitions: z.number(),
  partitionsQuorum: z.number(),
  partitionsAllOk: z.number(),
});

export type HealthReportResponse = z.infer<typeof HealthReportResponseSchema>;

export const ClusterDetailsSchema = z.object({
  node: z.string(),
  garageVersion: z.string(),
  garageFeatures: z.array(z.string()),
  rustVersion: z.string(),
  dbEngine: z.string(),
  nodes: z.array(
    z.object({
      id: z.string(),
      addr: z.string(),
      isUp: z.boolean(),
      lastSeenSecsAgo: z.number().nullable(),
      hostname: z.string(),
      dataPartition: z.object({
        available: z.number(),
        total: z.number(),
      }),
      role: z.object({
        id: z.string(),
        zone: z.string(),
        capacity: z.number(),
        tags: z.array(z.string()),
      }),
    }),
  ),
});

export type ClusterDetails = z.infer<typeof ClusterDetailsSchema>;

// {
//   "node": "f09e1c6d4bd1baa989738aa4d105d2fb7eed6d5b4d84155f2ad5a1347ae2c207",
//   "garageVersion": "v1.0.0",
//   "garageFeatures": [
//     "k2v",
//     "lmdb",
//     "sqlite",
//     "consul-discovery",
//     "kubernetes-discovery",
//     "metrics",
//     "telemetry-otlp",
//     "bundled-libs"
//   ],
//   "rustVersion": "1.73.0",
//   "dbEngine": "sqlite3 v3.45.0 (using rusqlite crate)",
//   "layoutVersion": 1,
//   "nodes": [
//     {
//       "id": "f09e1c6d4bd1baa989738aa4d105d2fb7eed6d5b4d84155f2ad5a1347ae2c207",
//       "role": {
//         "id": "f09e1c6d4bd1baa989738aa4d105d2fb7eed6d5b4d84155f2ad5a1347ae2c207",
//         "zone": "eu-central-1",
//         "capacity": 8000000000,
//         "tags": []
//       },
//       "addr": "127.0.0.1:3901",
//       "hostname": "ubuntu-4gb-nbg1-2",
//       "isUp": true,
//       "lastSeenSecsAgo": null,
//       "draining": false,
//       "dataPartition": {
//         "available": 21925896192,
//         "total": 39973924864
//       },
//       "metadataPartition": {
//         "available": 21925896192,
//         "total": 39973924864
//       }
//     }
//   ]
// }
