import { s3GarageClient } from '@/api/garage/s3-garage-client';
import { ClusterDetails } from '@/api/garage/s3-garage-client-responses';
import { useAppState } from '@/core/appHooks';
import { Drawer, DrawerApi } from '@/lib/components/Drawer';
import { LabeledInput } from '@/lib/components/form/LabeledInput';
import { LabeledSelect } from '@/lib/components/form/LabeledSelect';
import { LabeledTagsInput } from '@/lib/components/form/LabeledTagsInput';
import { IconSave } from '@/lib/components/icons/IconSave';
import { ToastType } from '@/lib/components/Toaster/Toast';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { errorToMessage } from '@/lib/util/error-to-message';
import { formatNumberToGBs } from '@/lib/util/format-number-to-GBs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useForm, UseFormRegister, UseFormWatch, Controller, Control } from 'react-hook-form';

export interface AddRoleFormProps {
  drawerApi: React.MutableRefObject<DrawerApi | null>;
  clusterDetails: ClusterDetails;
}

export function AddRoleForm({ drawerApi, clusterDetails }: AddRoleFormProps) {
  const { toast } = useToaster();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { isDirty },
  } = useForm<FormState>({
    defaultValues: { tags: [] },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormState) => {
      return s3GarageClient.updateLayout([
        {
          zone: data.zone,
          capacity: data.capacity,
          tags: data.tags,
          id: data.nodeId,
        },
      ]);
    },
    onSuccess: async () => {
      toast(<div>Addition staged</div>, ToastType.Success);
      await queryClient.invalidateQueries({ queryKey: ['layout'] });
      reset({ capacity: DEFAULT_CAPACITY, tags: [], zone: appState.settings.defaultAwsRegion, nodeId: '' });
    },
    onError: (e) => {
      setErrorMessage(errorToMessage(e));
    },
  });

  const appState = useAppState();

  useEffect(() => {
    if (!isDirty) {
      reset({ capacity: DEFAULT_CAPACITY, tags: [], zone: appState.settings.defaultAwsRegion, nodeId: '' });
    }
  }, [isDirty, appState.settings.defaultAwsRegion, reset]);

  const onSubmit = handleSubmit((it) => mutation.mutateAsync(it));

  const nodeOptions = clusterDetails.nodes.map((node) => ({ label: node.hostname ?? node.id, value: node.id }));

  return (
    <Drawer ref={drawerApi} drawerId="ADD_ROLE_FORM">
      <form className="p-2 flex flex-col gap-3" onSubmit={onSubmit}>
        {errorMessage && (
          <div className="p-2 animate-shake animate-once">
            <div role="alert" className="alert alert-error break-all text-wrap max-w-96">
              {errorMessage}
            </div>
          </div>
        )}
        <LabeledSelect label="Node" {...register('nodeId')} options={nodeOptions} />
        <CapacityInput register={register} watch={watch} />
        <LabeledInput label="Zone" {...register('zone')} />
        <TagInput control={control} />
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

const DEFAULT_CAPACITY = 1073741824; // 1GB

function CapacityInput(props: { register: UseFormRegister<FormState>; watch: UseFormWatch<FormState> }) {
  const { register, watch } = props;
  const capacity = watch('capacity');
  return (
    <LabeledInput
      label="Capacity in bytes"
      type="number"
      labelAlt={`approx ${formatNumberToGBs(capacity)}`}
      {...register('capacity', { valueAsNumber: true })}
    />
  );
}

function TagInput(props: { control: Control<FormState, unknown> }) {
  const { control } = props;
  return (
    <Controller
      control={control}
      name="tags"
      render={({ field }) => {
        return (
          <LabeledTagsInput
            name="tags"
            label="Tags"
            onBlur={field.onBlur}
            onChange={field.onChange}
            value={field.value || []}
          />
        );
      }}
    />
  );
}

interface FormState {
  zone: string;
  capacity: number;
  tags: string[];
  nodeId: string;
}
