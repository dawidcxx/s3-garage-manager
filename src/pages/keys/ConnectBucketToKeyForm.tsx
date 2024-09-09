import { Drawer, DrawerApi } from '@/lib/components/Drawer';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { LabeledInput } from '../../lib/components/form/LabeledInput';
import { IconSave } from '@/lib/components/icons/IconSave';
import { KeyDetails } from '@/api/garage/s3-garage-client-responses';
import { LabeledCheckbox } from '../../lib/components/form/LabeledCheckbox';
import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { errorToMessage } from '@/lib/util/error-to-message';
import { ToastType } from '@/lib/components/Toaster/Toast';

export function ConnectBucketToKeyForm(props: {
  selectedAccessKey: KeyDetails;
  drawerApi: React.MutableRefObject<DrawerApi | null>;
}) {
  const { selectedAccessKey, drawerApi } = props;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToaster();
  const { register, handleSubmit, reset } = useForm<ConnectBucketToKeyFormState>();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: ConnectBucketToKeyFormState) => {
      return s3GarageClient.allowKeyToBucket({
        accessKeyId: data.accessKeyId,
        bucketId: data.bucketId,
        permissions: {
          read: data.permissions.read,
          write: data.permissions.write,
          owner: data.permissions.owner,
        },
      });
    },
    onSuccess: async () => {
      toast('Bucket connected to key', ToastType.Success);
      await queryClient.invalidateQueries({ queryKey: ['keys'] });
      await queryClient.invalidateQueries({ queryKey: ['key', props.selectedAccessKey.accessKeyId] });
    },
    onError: (e) => {
      const msg = errorToMessage(e);
      setErrorMessage(msg);
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await mutation.mutateAsync(data);
  });

  useEffect(() => {
    reset({ accessKeyId: selectedAccessKey.accessKeyId });
    setErrorMessage(null);
  }, [reset, selectedAccessKey.accessKeyId]);

  return (
    <Drawer ref={drawerApi} drawerId="CONNECT_BUCKET_TO_KEY_FORM">
      {errorMessage && (
        <div className="p-2 animate-shake animate-once">
          <div role="alert" className="alert alert-error break-all text-wrap max-w-96">
            {errorMessage}
          </div>
        </div>
      )}
      <form className="flex flex-col gap-3 p-2" onSubmit={onSubmit}>
        <LabeledInput label="Key ID" {...register('accessKeyId')} disabled={true} />
        <LabeledInput label="Bucket ID" {...register('bucketId')} />
        <div className="pt-2">
          <p className="pl-1 mb-1 text-xs font-bold uppercase">Permissions</p>
          <LabeledCheckbox label="Read" {...register('permissions.read')} />
          <LabeledCheckbox label="Write" {...register('permissions.write')} />
          <LabeledCheckbox label="Owner" {...register('permissions.owner')} />
        </div>
        <div className="divider"></div>
        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending && <span className="loading loading-spinner w-4 h-4"></span>}
          {!mutation.isPending && <IconSave />}
          SAVE BUCKET TO KEY
        </button>
      </form>
    </Drawer>
  );
}

interface ConnectBucketToKeyFormState {
  bucketId: string;
  accessKeyId: string;
  permissions: {
    read: boolean;
    write: boolean;
    owner: boolean;
  };
}
