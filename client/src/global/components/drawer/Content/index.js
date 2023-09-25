import React, { forwardRef } from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import classNames from "classnames";
import Notifications from "global/containers/Notifications";
import FrontMatter from "../FrontMatter";
import { DrawerContext } from "helpers/contexts";
import { usePreventBodyScroll, useFromStore } from "hooks";
import * as Styled from "./styles";

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
    hasConfirm,
    showNotifications
  } = props;

  const connected = useFromStore("websocket.connected");
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

  /* eslint-disable no-nested-ternary */
  const Drawer =
    context === "reader"
      ? Styled.DrawerReader
      : context === "editor"
      ? Styled.DrawerEditor
      : position === "overlay"
      ? Styled.DrawerOverlay
      : Styled.Drawer;

  const Inner = context === "editor" ? Styled.DrawerEditorInner : "div";

  // A variety of other classes depend on .drawer--backend
  const classes = classNames(entrySide, size, `pad-${padding}`, {
    "drawer--backend": context === "backend"
  });

  const handleClickOutside = e => {
    if (context === "reader" || context === "editor") return;

    handleLeaveEvent(e);
    // Return false here so the focus trap isn't actually deactivated. While we want to respond to outside clicks, we want to either fully close the drawer or maintain the focus trap depending on the user's choice in the confirm modal.
    return false;
  };

  const handleBlur = e => {
    if (focusTrap || !ref?.current) return;
    if (ref.current.contains(event.relatedTarget)) return;

    if (hasConfirm) {
      const overlay = document.getElementById("global-overlay-container");
      if (overlay.contains(event.relatedTarget)) return;
    }

    handleLeaveEvent(e);
  };

  const inner = (
    <Inner>
      <FrontMatter {...props} />
      {(connected || showNotifications) && (
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
    </Inner>
  );

  return (
    <Drawer
      key="drawer"
      className={classes}
      id={id}
      role="dialog"
      aria-modal={focusTrap}
      aria-label={ariaLabel}
      aria-labelledby={headerId}
      ref={ref}
      onBlur={handleBlur}
      $fullHeight={focusTrap}
    >
      {focusTrap ? (
        <FocusTrap
          focusTrapOptions={{
            checkCanFocusTrap,
            allowOutsideClick: context === "reader",
            clickOutsideDeactivates: handleClickOutside,
            escapeDeactivates: handleEscape,
            returnFocusOnDeactivate
          }}
        >
          {inner}
        </FocusTrap>
      ) : (
        inner
      )}
    </Drawer>
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
