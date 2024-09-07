import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { Drawer, DrawerApi } from '@/lib/components/Drawer';
import { LabeledInput } from '@/lib/components/form/LabeledInput';
import { LabeledTagsInput } from '@/lib/components/form/LabeledTagsInput';
import { IconSave } from '@/lib/components/icons/IconSave';
import { ToastType } from '@/lib/components/Toaster/Toast';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { errorToMessage } from '@/lib/util/error-to-message';
import { formatNumberToGBs } from '@/lib/util/format-number-to-GBs';
import { generateRandomSha256 } from '@/lib/util/generate-random-sha256';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useFieldArray, useForm, UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';

export interface AddRoleFormProps {
  drawerApi: React.MutableRefObject<DrawerApi | null>;
}

export function AddRoleForm({ drawerApi }: AddRoleFormProps) {
  const { toast } = useToaster();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { register, handleSubmit, reset, watch, setValue } = useForm<FormState>({ defaultValues: { tags: [] } });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormState) => {
      const id = await generateRandomSha256();
      return s3GarageClient.updateLayout([
        {
          zone: data.zone,
          capacity: data.capacity,
          tags: data.tags,
          id,
        },
      ]);
    },
    onSuccess: async () => {
      toast(<div>Addition staged</div>, ToastType.Success);
      reset();
      await queryClient.invalidateQueries({ queryKey: ['layout'] });
    },
    onError: (e) => {
      setErrorMessage(errorToMessage(e));
    },
  });

  useEffect(() => {
    const GIGABYTE_IN_BYTES = 1073741824;
    reset({ capacity: GIGABYTE_IN_BYTES, tags: [], zone: '' });
  }, [reset]);

  return (
    <Drawer ref={drawerApi} drawerId="ADD_ROLE_FORM">
      <form className="p-2 flex flex-col gap-3">
        {errorMessage && (
          <div className="p-2 animate-shake animate-once">
            <div role="alert" className="alert alert-error break-all text-wrap max-w-96">
              {errorMessage}
            </div>
          </div>
        )}
        <CapacityInput register={register} watch={watch} />
        <LabeledInput label="Zone" {...register('zone')} />
        <TagInput register={register} watch={watch} setValue={setValue} />
        <div className="divider" />

        <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
          {mutation.isPending && <span className="loading loading-spinner w-4 h-4"></span>}
          {!mutation.isPending && <IconSave />}
          STAGE NEW ROLE
        </button>
      </form>
    </Drawer>
  );
}

function CapacityInput(props: { register: UseFormRegister<FormState>; watch: UseFormWatch<FormState> }) {
  const { register, watch } = props;
  const capacity = watch('capacity');
  return (
    <LabeledInput
      label="Capacity in bytes"
      type="number"
      labelAlt={`approx ${formatNumberToGBs(capacity)}`}
      {...register('capacity')}
    />
  );
}

function TagInput(props: {
  register: UseFormRegister<FormState>;
  watch: UseFormWatch<FormState>;
  setValue: UseFormSetValue<FormState>;
}) {
  const { register, watch, setValue } = props;
  return (
    <LabeledTagsInput
      {...register('tags')}
      label="Tags"
      value={watch('tags')}
      onChange={(it) => setValue('tags', it)}
    />
  );
}

interface FormState {
  zone: string;
  capacity: number;
  tags: string[];
}
