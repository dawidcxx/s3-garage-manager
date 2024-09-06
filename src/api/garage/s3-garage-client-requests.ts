import { access } from 'fs';
import { permission } from 'process';
import { z } from 'zod';

export const CreateBucketRequestSchema = z.object({
  globalAlias: z.string().optional(),
  localAlias: z
    .object({
      accessKeyId: z.string(),
      alias: z.string(),
      allow: z.object({
        read: z.boolean(),
        write: z.boolean(),
        owner: z.boolean(),
      }),
    })
    .optional(),
});

export type CreateBucketRequest = z.infer<typeof CreateBucketRequestSchema>;

export const AllowKeyToBucketRequestSchema = z.object({
  bucketId: z.string(),
  accessKeyId: z.string(),
  permissions: z.object({
    read: z.boolean().default(false),
    write: z.boolean().default(false),
    owner: z.boolean().default(false),
  }),
});

export type AllowKeyToBucketRequest = z.infer<typeof AllowKeyToBucketRequestSchema>;