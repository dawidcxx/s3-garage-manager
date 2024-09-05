import { Drawer, DrawerApi } from '@/components/Drawer';
import { LabeledCheckbox } from './LabeledCheckbox';
import { LabeledInput } from './LabeledInput';
import { SubmitHandler, useForm } from 'react-hook-form';
import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { useState } from 'react';
import { IconSave } from '@/components/icons/IconSave';
import { errorToMessage } from '@/lib/util/error-to-message';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToaster } from '@/components/Toaster/useToaster';
import { ToastType } from '@/components/Toaster/Toast';

export interface BucketCreateFormProps {
  drawerApi: React.MutableRefObject<DrawerApi | null>;
}

export function BucketCreateForm({ drawerApi }: BucketCreateFormProps) {
  const { toast } = useToaster();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset } = useForm<FormState>();
  const queryClient = useQueryClient();

  const createBucketMutation = useMutation({
    mutationFn: (data: FormState) =>
      s3GarageClient.createBucket({
        globalAlias: data.globalAliasName,
        localAlias: data.localAliasName
          ? {
              alias: data.localAliasName,
              accessKeyId: data.localAliasKey,
              allow: {
                read: data.localAliasRead,
                write: data.localAliasWrite,
                owner: data.localAliasOwner,
              },
            }
          : undefined,
      }),
    onSuccess: async () => {
      setErrorMessage(null);
      toast('Bucket Created', ToastType.Success);
      reset();
      await queryClient.invalidateQueries({ queryKey: ['buckets'] });
    },
    onError: (e) => {
      setErrorMessage(errorToMessage(e));
    },
  });

  const onSubmit: SubmitHandler<FormState> = (data) => createBucketMutation.mutateAsync(data);

  return (
    <Drawer ref={drawerApi}>
      {errorMessage && (
        <div className="p-2 animate-shake animate-once ">
          <div role="alert" className="alert alert-error break-all text-wrap max-w-96">
            {errorMessage}
          </div>
        </div>
      )}
      <form className="flex flex-col gap-3 p-2" onSubmit={handleSubmit(onSubmit)}>
        <LabeledInput label="Global Alias Name" {...register('globalAliasName')} />
        <div className="divider"></div>
        <LabeledInput label="Local Alias Name" {...register('localAliasName')} />
        <LabeledInput label="Local Alias Key" {...register('localAliasKey')} />
        <div className="pt-2">
          <p className="pl-1 mb-1 text-xs font-bold uppercase">Local Alias Permissions</p>
          <LabeledCheckbox label="Read" {...register('localAliasRead')} />
          <LabeledCheckbox label="Write" {...register('localAliasWrite')} />
          <LabeledCheckbox label="Owner" {...register('localAliasOwner')} />
        </div>
        <div className="divider"></div>
        <button type="submit" className="btn btn-primary" disabled={createBucketMutation.isPending}>
          {createBucketMutation.isPending && <span className="loading loading-spinner w-4 h-4"></span>}
          {!createBucketMutation.isPending && <IconSave />}
          CREATE NEW BUCKET
        </button>
      </form>
    </Drawer>
  );
}

interface FormState {
  globalAliasName: string;
  localAliasName: string;
  localAliasKey: string;
  localAliasRead: boolean;
  localAliasWrite: boolean;
  localAliasOwner: boolean;
}
