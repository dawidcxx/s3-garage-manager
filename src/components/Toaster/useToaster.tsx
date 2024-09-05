import { useAtom } from 'jotai';
import { toastAtom } from './toastsAtom';
import { ToastType } from './Toast';

let toastIdSeq = 0;
const DEFAULT_TIMEOUT = 10_000;

export function useToaster() {
  const [, setToasts] = useAtom(toastAtom);

  return {
    toast: (message: React.ReactNode, toastType: ToastType = ToastType.Default, timeout = DEFAULT_TIMEOUT) => {
      const id = toastIdSeq;
      toastIdSeq += 1;

      setToasts((toasts) => {
        return [...toasts, { id, message, toastType }];
      });

      setTimeout(() => {
        setToasts((toasts) => {
          return toasts.filter((toast) => toast.id !== id);
        });
      }, timeout);
    },
  };
}
