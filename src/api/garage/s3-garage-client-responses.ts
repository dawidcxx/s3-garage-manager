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
      addr: z.string().nullable(),
      isUp: z.boolean(),
      lastSeenSecsAgo: z.number().nullable(),
      hostname: z.string().nullable(),
      dataPartition: z
        .object({
          available: z.number(),
          total: z.number(),
        })
        .optional(),
      role: z
        .object({
          id: z.string(),
          zone: z.string(),
          capacity: z.number(),
          tags: z.array(z.string()),
        })
        .nullable(),
    }),
  ),
});

export type ClusterDetails = z.infer<typeof ClusterDetailsSchema>;

export const LayoutDescriptionSchema = z.object({
  version: z.number(),
  roles: z.array(
    z.object({
      id: z.string(),
      zone: z.string(),
      capacity: z.number(),
      tags: z.array(z.string()),
    }),
  ),
  stagedRoleChanges: z.array(
    z.object({
      id: z.string(),

      zone: z.string().optional(),
      capacity: z.number().optional(),
      tags: z.array(z.string()).optional(),

      remove: z.boolean().optional(),
    }),
  ),
});

export type LayoutDescription = z.infer<typeof LayoutDescriptionSchema>;
