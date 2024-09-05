import { Drawer, DrawerApi } from '@/components/Drawer';
import { useForm } from 'react-hook-form';
import { LabeledInput } from '../buckets/LabeledInput';
import { IconSave } from '@/components/icons/IconSave';
import { useState } from 'react';
import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { errorToMessage } from '@/lib/util/error-to-message';
import { useToaster } from '@/components/Toaster/useToaster';
import { ToastType } from '@/components/Toaster/Toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';

interface CreateKeyFormState {
  name: string;
}

export interface CreateKeyFormProps {
  drawerApi: React.MutableRefObject<DrawerApi | null>;
}

export function CreateKeyForm({ drawerApi }: CreateKeyFormProps) {
  const [, setUrlSearchParams] = useSearchParams();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToaster();
  const { register, handleSubmit, reset } = useForm<CreateKeyFormState>();
  const queryClient = useQueryClient();

  const createKeyMutation = useMutation({
    mutationFn: (data: CreateKeyFormState) => s3GarageClient.createKey(data.name),
    onSuccess: async ({ accessKeyId }) => {
      toast(<KeyCreatedAlert />, ToastType.Success);
      reset();
      await queryClient.invalidateQueries({ queryKey: ['keys'] });
      setUrlSearchParams({ key: accessKeyId });
    },
    onError: (e) => {
      setErrorMessage(errorToMessage(e));
    },
  });

  const onSubmit = handleSubmit(async (data) => {
    await createKeyMutation.mutateAsync(data);
  });

  return (
    <Drawer ref={drawerApi}>
      {errorMessage && (
        <div className="p-2 animate-shake animate-once">
          <div role="alert" className="alert alert-error break-all text-wrap max-w-96">
            {errorMessage}
          </div>
        </div>
      )}
      <form className="flex flex-col gap-3 p-2" onSubmit={onSubmit}>
        <LabeledInput label="Key name" {...register('name')} />
        <div className="divider"></div>
        <button type="submit" className="btn btn-primary" disabled={createKeyMutation.isPending}>
          {createKeyMutation.isPending && <span className="loading loading-spinner w-4 h-4"></span>}
          {!createKeyMutation.isPending && <IconSave />}
          CREATE NEW BUCKET
        </button>
      </form>
    </Drawer>
  );
}

function KeyCreatedAlert() {
  return (
    <div className="flex flex-row gap-4">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>Key Created</span>
    </div>
  );
}
