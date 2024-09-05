

export interface Toast {
  id: number;
  message: React.ReactNode;
  toastType: ToastType;
}

export enum ToastType {
  Default,
  Error,
  Success,
}

