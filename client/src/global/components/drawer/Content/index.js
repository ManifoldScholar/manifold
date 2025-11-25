import { forwardRef, useRef } from "react";
import PropTypes from "prop-types";
import { FocusTrap } from "focus-trap-react";
import classNames from "classnames";
import Notifications from "global/containers/Notifications";
import FrontMatter from "../FrontMatter";
import { DrawerContext } from "helpers/contexts";
import { usePreventBodyScroll } from "hooks";
import * as Styled from "./styles";

function DrawerContent(props, forwardedRef) {
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
    showNotifications,
    open,
    additionalDrawerProps = {}
  } = props;

  const internalRef = useRef(null);
  const ref = forwardedRef ?? internalRef;

  usePreventBodyScroll(lockScroll && open);

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

  let Drawer = Styled.Drawer;

  if (context === "reader") {
    Drawer =
      position === "overlay" ? Styled.DrawerReaderOverlay : Styled.DrawerReader;
  } else if (context === "editor") {
    Drawer = Styled.DrawerEditor;
  } else if (position === "overlay") {
    Drawer = Styled.DrawerOverlay;
  }

  const Inner = context === "editor" ? Styled.DrawerEditorInner : "div";

  // A variety of other classes depend on .drawer--backend
  const classes = classNames(entrySide, size, `pad-${padding}`, {
    "drawer--backend": context === "backend" || context === "ingestion"
  });

  const handleClickOutside = e => {
    if (context === "reader" || context === "editor" || context === "ingestion")
      return;

    handleLeaveEvent(e);
    // Return false here so the focus trap isn't actually deactivated. While we want to respond to outside clicks, we want to either fully close the drawer or maintain the focus trap depending on the user's choice in the confirm modal.
    return false;
  };

  const handleBlur = e => {
    if (focusTrap || !ref.current) return;
    if (ref.current.contains(e.relatedTarget)) return;

    if (hasConfirm) {
      const overlay = document.getElementById("global-overlay-container");
      if (overlay.contains(e.relatedTarget)) return;
    }

    handleLeaveEvent(e);
  };

  const drawerProps = {
    ref,
    className: classes,
    id,
    role: "dialog",
    tabIndex: focusTrap ? -1 : undefined,
    "aria-modal": focusTrap,
    "aria-label": ariaLabel,
    "aria-labelledby": headerId,
    onBlur: handleBlur,
    $fullHeight: focusTrap,
    inert: !open ? "" : undefined,
    ...additionalDrawerProps
  };

  const inner = (
    <Inner>
      <FrontMatter {...props} />
      {showNotifications && (
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

  return focusTrap && lockScroll ? (
    <FocusTrap
      active={open}
      focusTrapOptions={{
        checkCanFocusTrap,
        allowOutsideClick: context === "reader",
        clickOutsideDeactivates: handleClickOutside,
        escapeDeactivates: handleEscape,
        returnFocusOnDeactivate,
        fallbackFocus: () => ref.current,
        preventScroll: context === "reader"
      }}
    >
      <Drawer key="drawer" {...drawerProps}>
        {inner}
      </Drawer>
    </FocusTrap>
  ) : (
    <Drawer key="drawer" {...drawerProps}>
      {inner}
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
  hasConfirm: PropTypes.bool,
  open: PropTypes.bool,
  additionalDrawerProps: PropTypes.object
};
