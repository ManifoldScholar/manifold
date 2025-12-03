import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect
} from "react";
import { useBlocker } from "react-router";
import { useTranslation } from "react-i18next";
import Dialog from "global/components/dialog";

const NavigationBlockerContext = createContext(null);

export function NavigationBlockerProvider({ children }) {
  const { t } = useTranslation();
  const blockersRef = useRef(new Map());

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

  // Auto-proceed if no blockers remain while blocked
  // Needed to prevent blocking on submit
  useEffect(() => {
    if (blocker.state === "blocked" && blockersRef.current.size === 0) {
      blocker.proceed();
    }
  }, [blocker.state, blocker]);

  const message = () => {
    const activeBlocker = Array.from(blockersRef.current.entries())[0];
    if (activeBlocker) {
      const [, { message: activeMessage }] = activeBlocker;
      return activeMessage;
    }
    return null;
  };

  return (
    <NavigationBlockerContext.Provider
      value={{
        registerBlocker,
        unregisterBlocker
      }}
    >
      {children}
      {blocker.state === "blocked" && (
        <Dialog.Confirm
          message={message()}
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
