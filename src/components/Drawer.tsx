import { isNil } from '@/lib/util/isNil';
import { requireNotNull } from '@/lib/util/require-not-null';
import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useRef } from 'react';

export interface DrawerApi {
  openDrawer(): void;
  closeDrawer(): void;
  toggleDrawer(): void;
}

export interface DrawerProps {
  children: ReactNode;
}

export const Drawer = forwardRef<DrawerApi, DrawerProps>(({ children }: DrawerProps, ref) => {
  const drawerRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(ref, () => ({
    openDrawer: () => {
      const drawerNode = requireNotNull(drawerRef.current, 'drawerRef');
      drawerNode.checked = true;
    },
    closeDrawer: () => {
      const drawerNode = requireNotNull(drawerRef.current, 'drawerRef');
      drawerNode.checked = false;
    },
    toggleDrawer: () => {
      const drawerNode = requireNotNull(drawerRef.current, 'drawerRef');
      drawerNode.click();
    },
  }));

  const closeOnEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isNil(drawerRef.current)) {
        drawerRef.current.checked = false;
      }
    },
    [drawerRef],
  );

  useEffect(() => {
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [closeOnEscape]);

  return (
    <div className="drawer drawer-end z-10">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" ref={drawerRef} />
      <div className="drawer-side">
        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="menu bg-base-200 text-base-content min-h-full w-96 max-w-96 p-2">{children}</div>
      </div>
    </div>
  );
});
