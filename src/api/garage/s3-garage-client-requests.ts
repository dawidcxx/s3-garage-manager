import { z } from 'zod';

export const CreateBucketRequestSchema = z.union([
  z.object({
    globalAlias: z.string(),
  }),
  z.object({
    localAlias: z.object({
      accessKeyId: z.string(),
      alias: z.string(),
      allow: z.object({
        read: z.boolean(),
        write: z.boolean(),
        owner: z.boolean(),
      }),
    }),
  }),
]);

export type CreateBucketRequest = z.infer<typeof CreateBucketRequestSchema>;
