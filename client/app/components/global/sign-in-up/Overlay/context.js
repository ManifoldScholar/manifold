import { createContext, useContext, useCallback } from "react";
import useDialog from "@castiron/hooks/useDialog";
import Overlay from "./index";

export const SignInUpOverlayContext = createContext(null);

// TODO: When migrating backend routes / Authorize HOC, add handling for
// location.state?.showLogin here (the old Manifold container handled this).
export function SignInUpOverlayProvider({ children }) {
  const dialog = useDialog({ modal: true, scrollLockClassName: "no-scroll" });

  const show = useCallback(() => {
    if (!dialog.open) dialog.onToggleClick();
  }, [dialog]);

  const hide = dialog.onCloseClick;
  const toggle = dialog.onToggleClick;

  return (
    <SignInUpOverlayContext.Provider value={{ show, hide, toggle }}>
      {children}
      <Overlay ref={dialog.dialogRef} active={dialog.open} hide={hide} />
    </SignInUpOverlayContext.Provider>
  );
}

export function useSignInUpOverlay() {
  const ctx = useContext(SignInUpOverlayContext);
  if (!ctx) return { show: () => {}, hide: () => {}, toggle: () => {} };
  return ctx;
}
