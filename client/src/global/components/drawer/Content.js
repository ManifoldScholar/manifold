import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import classNames from "classnames";
import Notifications from "global/containers/Notifications";
import FrontMatter from "./FrontMatter";
import { DrawerContext } from "helpers/contexts";
import { useSelector } from "react-redux";
import { usePreventBodyScroll } from "hooks";

function DrawerContent(props, ref) {
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
    lockScroll = false,
    hasConfirm
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

  const handleEscape = e => {
    e.preventDefault();
    handleLeaveEvent(e);

    if (hasConfirm) return false;
    return true;
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
      ref={ref}
    >
      <FocusTrap
        focusTrapOptions={{
          checkCanFocusTrap,
          allowOutsideClick: true,
          escapeDeactivates: handleEscape,
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

export default forwardRef(DrawerContent);

DrawerContent.displayName = "Drawer.Content";

DrawerContent.propTypes = {
  headerId: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  focusTrap: PropTypes.bool,
  ariaLabel: PropTypes.string,
  returnFocusOnDeactivate: PropTypes.bool,
  context: PropTypes.string,
  entrySide: PropTypes.oneOf(["right", "left"]),
  size: PropTypes.oneOf(["default", "wide", "flexible"]),
  padding: PropTypes.oneOf(["none", "default", "large"]),
  position: PropTypes.oneOf(["default", "overlay"]),
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  handleLeaveEvent: PropTypes.func.isRequired,
  lockScroll: PropTypes.bool,
  hasConfirm: PropTypes.bool
};
