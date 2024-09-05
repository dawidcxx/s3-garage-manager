import { useAtom } from 'jotai';
import { toastAtom } from './toastsAtom';
import { ToastType } from './Toast';
import { isNil } from '@/lib/util/isNil';

let toastIdSeq = 0;
const DEFAULT_TIMEOUT = 5_000;
const DEFAULT_ON_ERROR_TIMEOUT = 10_000;

export function useToaster() {
  const [, setToasts] = useAtom(toastAtom);

  return {
    toast: (message: React.ReactNode, toastType: ToastType = ToastType.Default, timeout?: number) => {
      const id = toastIdSeq;
      toastIdSeq += 1;

      // Use user provided timeout
      // If timeout is not provided, use default timeout based on toast type
      const computedTimeout = isNil(timeout)
        ? toastType === ToastType.Error
          ? DEFAULT_ON_ERROR_TIMEOUT
          : DEFAULT_TIMEOUT
        : timeout;

      setToasts((toasts) => {
        return [...toasts, { id, message, toastType }];
      });

      setTimeout(() => {
        setToasts((toasts) => {
          return toasts.filter((toast) => toast.id !== id);
        });
      }, computedTimeout);
    },
  };
}
