import clsx from 'clsx';
import { useAtom } from 'jotai';
import { toastAtom } from './toastsAtom';
import { ToastType } from './Toast';

export function Toaster() {
  const [toasts] = useAtom(toastAtom);

  return (
    <div className="toast toast-center z-20">
      {toasts.map((toast) => {
        return (
          <div
            className={clsx('alert animate-jump animate-once animate-duration-500 animate-ease-in-out', {
              'alert-neutral': toast.toastType === ToastType.Default,
              'alert-error': toast.toastType === ToastType.Error,
              'alert-success': toast.toastType === ToastType.Success,
            })}
            key={toast.id}
          >
            <div>{toast.message}</div>
          </div>
        );
      })}
    </div>
  );
}
