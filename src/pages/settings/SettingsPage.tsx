import { authAtom } from '@/core/atoms/authAtom';
import { dashboardSettingsAtom } from '@/core/atoms/dashboardSettingsAtom';
import { LabeledCheckbox } from '@/lib/components/form/LabeledCheckbox';
import { LabeledInput } from '@/lib/components/form/LabeledInput';
import { useToaster } from '@/lib/components/Toaster/useToaster';
import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

export function SettingsPage() {
  const [auth, setAuth] = useAtom(authAtom);
  const [dashboardSettings, setDashboardSettings] = useAtom(dashboardSettingsAtom);

  const { register, reset, handleSubmit } = useForm<FormState>();
  const { toast } = useToaster();

  useEffect(() => {
    reset({
      token: auth.token,
      saveTokenToLocalStorage: auth.saveToLocalStorage,
      suggestedAWSRegion: dashboardSettings.defaultAwsRegion,
    });
  }, [reset, auth, dashboardSettings]);

  const onSubmit = handleSubmit((data) => {
    setAuth({  token: data.token, saveToLocalStorage: data.saveTokenToLocalStorage });
    setDashboardSettings({ defaultAwsRegion: data.suggestedAWSRegion });
    toast('Settings Updated');
  });

  return (
    <div className="max-w-md">
      <pre>{JSON.stringify(auth, null, 2)}</pre>
      <form className="flex flex-col gap-6" onSubmit={onSubmit} autoComplete="off">
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
