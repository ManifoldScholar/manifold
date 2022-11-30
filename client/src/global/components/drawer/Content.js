import React from "react";
import FocusTrap from "focus-trap-react";
import classNames from "classnames";
import Notifications from "global/containers/Notifications";
import FrontMatter from "./FrontMatter";
import { DrawerContext } from "helpers/contexts";
import { useSelector } from "react-redux";
import { usePreventBodyScroll } from "hooks";

export default function DrawerContent(props) {
  const {
    headerId,
    id,
    focusTrap = true,
    ariaLabel,
    returnFocusOnDeactivate = true,
    context = "backend",
    entrySide = "right",
    size = "default",
    padding = "default",
    position = "default",
    children,
    handleLeaveEvent,
    lockScroll
  } = props;

  const connected = useSelector(state => state.websocket.connected);
  usePreventBodyScroll(lockScroll);

  // Waits for animation to finish before focusing in trap.
  const checkCanFocusTrap = trapContainers => {
    const results = trapContainers.map(trapContainer => {
      return new Promise(resolve => {
        const interval = setInterval(() => {
          if (getComputedStyle(trapContainer).visibility !== "hidden") {
            resolve();
            clearInterval(interval);
          }
        }, 5);
      });
    });
    return Promise.all(results);
  };

  const drawerClasses = classNames(
    "drawer",
    [`drawer--${context}`],
    [`drawer--${entrySide}`],
    [`drawer--${size}`],
    [`drawer--pad-${padding}`],
    [`drawer--pos-${position}`]
  );

  return (
    <div
      key="drawer"
      className={drawerClasses}
      id={id}
      role="dialog"
      aria-modal={focusTrap}
      aria-label={ariaLabel}
      aria-labelledby={headerId}
    >
      <FocusTrap
        focusTrapOptions={{
          checkCanFocusTrap,
          allowOutsideClick: true,
          escapeDeactivates: handleLeaveEvent,
          returnFocusOnDeactivate
        }}
      >
        <div>
          <FrontMatter {...props} />
          {connected && (
            <Notifications scope="drawer" style="drawer" animate={false} />
          )}
          <DrawerContext.Provider value={{ headerId }}>
            {!!children &&
              (typeof children === "string"
                ? children
                : React.cloneElement(children, {
                    closeDrawer: handleLeaveEvent
                  }))}
          </DrawerContext.Provider>
        </div>
      </FocusTrap>
    </div>
  );
}
