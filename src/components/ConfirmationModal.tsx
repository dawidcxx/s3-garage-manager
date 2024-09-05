import { isNil } from '@/lib/util/isNil';
import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

export interface ModalApi {
  open(): Promise<boolean>;
}

export interface ModalProps {
  modalId: string;
  children?: React.ReactNode;
}

export const ConfirmationModal = forwardRef<ModalApi, ModalProps>(({ children, modalId }: ModalProps, ref) => {
  const modalRef = useRef<HTMLDialogElement | null>(null);
  const pendingModalPromise = useRef<((value: boolean) => void) | null>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      return new Promise((resolve) => {
        pendingModalPromise.current = resolve;
        modalRef.current?.showModal();
      });
    },
  }));

  // Listen for ESC key to close the modal
  useEffect(() => {
    function onModalClose() {
      const resolveFn = pendingModalPromise.current;
      if (!isNil(resolveFn)) {
        resolveFn(false);
        pendingModalPromise.current = null;
      }
    }

    const modal = modalRef.current;
    if (isNil(modal)) {
      return;
    }
    modal.addEventListener('close', onModalClose);
    return () => {
      modal.removeEventListener('close', onModalClose);
    };
  }, []);

  // If someone presses "Confirm" button
  const onConfirmBtnClick = () => {
    const resolveFn = pendingModalPromise.current;
    if (!isNil(resolveFn)) {
      resolveFn(true);
      pendingModalPromise.current = null;
    }
  };

  // If someone presses "Cancel" button
  const onCancelBtnClick = () => {
    const resolveFn = pendingModalPromise.current;
    if (!isNil(resolveFn)) {
      resolveFn(false);
      pendingModalPromise.current = null;
    }
    modalRef.current?.close();
  };

  return (
    <dialog id={modalId} className="modal" ref={modalRef}>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Are you sure?</h3>
        <div className="py-4">{children}</div>
        <div className="divider" />
        <div className="modal-action">
          <form method="dialog" className="flex flex-row gap-3 justify-end">
            <button className="btn" type="reset" onClick={onCancelBtnClick}>
              Cancel
            </button>
            <button className="btn btn-error" type="submit" onClick={onConfirmBtnClick}>
              Confirm
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
});
