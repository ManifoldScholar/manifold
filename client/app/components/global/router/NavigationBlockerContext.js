import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useRef,
  useState,
  useEffect
} from "react";
import { useBlocker } from "react-router";
import { useTranslation } from "react-i18next";
import Dialog from "components/global/dialog";

const NavigationBlockerContext = createContext(null);

export function NavigationBlockerProvider({ children }) {
  const { t } = useTranslation();
  const blockersRef = useRef(new Map());
  const [confirmMessage, setConfirmMessage] = useState(null);

  const registerBlocker = useCallback((id, message) => {
    blockersRef.current.set(id, { message });
  }, []);

  const unregisterBlocker = useCallback(id => {
    blockersRef.current.delete(id);
  }, []);

  const shouldBlock = useCallback(({ currentLocation, nextLocation }) => {
    if (
      blockersRef.current.size > 0 &&
      currentLocation.pathname !== nextLocation.pathname
    ) {
      return true;
    }
    return false;
  }, []);

  const blocker = useBlocker(shouldBlock);

  /*
  A component can unregister its blocker in the same commit that it navigates,
  rendering the dialog for one commit, which moves focus into it. Use an
  effect here to delay rendering long enough for unregistration.
  */
  useEffect(() => {
    if (blocker.state !== "blocked") {
      setConfirmMessage(null);
      return;
    }

    const activeBlocker = blockersRef.current.values().next().value;

    if (!activeBlocker) {
      blocker.proceed();
      return;
    }

    setConfirmMessage(activeBlocker.message);
  }, [blocker]);

  const value = useMemo(() => ({ registerBlocker, unregisterBlocker }), [
    registerBlocker,
    unregisterBlocker
  ]);

  return (
    <NavigationBlockerContext.Provider value={value}>
      {children}
      {blocker.state === "blocked" && confirmMessage && (
        <Dialog.Confirm
          message={confirmMessage}
          heading={t("messages.confirm")}
          resolve={blocker.proceed}
          reject={blocker.reset}
        />
      )}
    </NavigationBlockerContext.Provider>
  );
}

export function useNavigationBlocker() {
  const context = useContext(NavigationBlockerContext);
  if (!context) {
    throw new Error(
      "useNavigationBlocker must be used within a NavigationBlockerProvider"
    );
  }
  return context;
}
