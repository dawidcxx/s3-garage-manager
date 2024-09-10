import { useAppDispatcher, useAppState } from '@/core/appHooks';
import { LabeledCheckbox } from '@/lib/components/form/LabeledCheckbox';
import { LabeledInput } from '@/lib/components/form/LabeledInput';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function SettingsPage() {
  const appState = useAppState();
  const appDispatch = useAppDispatcher();
  const { register, reset, handleSubmit } = useForm<FormState>();
  const { toast } = useToaster();

  useEffect(() => {
    reset({
      token: appState.auth.token,
      saveTokenToLocalStorage: appState.auth.saveToLocalStorage,
      suggestedAWSRegion: appState.settings.defaultAwsRegion,
    });
  }, [reset, appState]);

  const onSubmit = handleSubmit( (data) => {
    appDispatch({
      type: 'UPDATE_APP_SETTINGS',
      payload: {
        settings: {
          defaultAwsRegion: data.suggestedAWSRegion,
        },
        auth: {
          token: data.token,
          saveToLocalStorage: data.saveTokenToLocalStorage,
        },
      },
    });
    toast('Settings Updated')
  });

  return (
    <div className="max-w-md">
      <form className="flex flex-col gap-6" onSubmit={onSubmit} autoComplete='off'>
        <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200 border">
          <input type="checkbox" className="peer" defaultChecked />
          <div className="collapse-title text-xl font-medium">Authentication</div>
          <div className="collapse-content flex flex-col gap-6">
            <LabeledInput type="password" label="Token" {...register('token')} />
            <LabeledCheckbox label="Save Token to LocalStorage" {...register('saveTokenToLocalStorage')} />
          </div>
        </div>
        <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200 border">
          <input type="checkbox" className="peer" defaultChecked />
          <div className="collapse-title text-xl font-medium">Dashboard settings</div>
          <div className="collapse-content">
            <LabeledInput
              type="text"
              label="Default AWS region"
              tooltip="In forms when asked for a AWS region, this value will be pre-filled using this value"
              placeholder="for example: us-west-1"
              {...register('suggestedAWSRegion')}
            />
          </div>
        </div>
        <div className="pl-2 pr-2">
          <button className="btn btn-primary w-full">Apply</button>
        </div>
      </form>
    </div>
  );
}

interface FormState {
  token: string;
  saveTokenToLocalStorage: boolean;
  suggestedAWSRegion: string;
}
