import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import Utility from "global/components/utility";
import { notificationActions } from "actions";
import Content from "../Content";
import * as Styled from "./styles";

export default function DrawerWrapper({
  lockScroll = "hover",
  open = false,
  dispatch,
  history,
  identifier,
  ...props
}) {
  const { closeCallback, closeUrl } = props;
  const uid = useUID();

  useEffect(() => {
    if (open) {
      if (dispatch) dispatch(notificationActions.removeNotifications("global"));
    }
  }, [open, dispatch]);

  const clearDrawerNotifications = () => {
    if (dispatch) dispatch(notificationActions.removeNotifications("drawer"));
  };

  const handleLeaveEvent = e => {
    clearDrawerNotifications();

    if (closeCallback) {
      closeCallback(e);
    }

    if (closeUrl) {
      history.push(closeUrl, { noScroll: true });
    }
  };

  if (lockScroll === "hover") {
    return (
      <Utility.EdgeLockScroll>
        <Content
          headerId={uid}
          handleLeaveEvent={handleLeaveEvent}
          hasConfirm={!!closeUrl}
          open={open}
          {...props}
        />
      </Utility.EdgeLockScroll>
    );
  }

  if (lockScroll === "always") {
    return (
      <>
        <Styled.Overlay
          inert={!open ? "" : undefined}
          style={{
            "--z-index":
              identifier === "notes-drawer" ||
              identifier === "annotations-drawer"
                ? 150
                : 500
          }}
        />
        <Content
          headerId={uid}
          handleLeaveEvent={handleLeaveEvent}
          hasConfirm={!!closeUrl}
          lockScroll
          open={open}
          {...props}
        />
      </>
    );
  }

  return (
    <Content
      headerId={uid}
      handleLeaveEvent={handleLeaveEvent}
      hasConfirm={!!closeUrl}
      open={open}
      {...props}
    />
  );
}

DrawerWrapper.displayName = "Drawer.Wrapper";

DrawerWrapper.propTypes = {
  dispatch: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  identifier: PropTypes.string,
  closeUrl: PropTypes.string,
  closeCallback: PropTypes.func,
  lockScroll: PropTypes.string,
  entrySide: PropTypes.oneOf(["right", "left", "top"]),
  context: PropTypes.oneOf(["backend", "frontend", "reader", "editor"]),
  size: PropTypes.oneOf(["default", "wide", "flexible", "fixed"]),
  position: PropTypes.oneOf(["default", "overlay"]),
  padding: PropTypes.oneOf(["none", "default", "large", "xl"]),
  history: PropTypes.object,
  includeDrawerFrontMatter: PropTypes.bool,
  returnFocusOnDeactivate: PropTypes.bool,
  focusTrap: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
