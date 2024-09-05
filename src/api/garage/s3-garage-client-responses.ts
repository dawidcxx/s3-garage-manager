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
  secretAccessKey: z.string()
}); 

export type CreatedKey = z.infer<typeof CreatedKeySchema>;