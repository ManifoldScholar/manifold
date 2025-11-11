import { useEffect } from "react";
import PropTypes from "prop-types";
import { useUID } from "react-uid";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { notificationActions } from "actions";
import Content from "../Content";
import * as Styled from "./styles";

export default function DrawerWrapper({
  lockScroll = "always",
  open = false,
  identifier,
  ...props
}) {
  const { closeCallback, closeUrl } = props;
  const uid = useUID();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      dispatch(notificationActions.removeNotifications("global"));
    }
  }, [open, dispatch]);

  const clearDrawerNotifications = () => {
    dispatch(notificationActions.removeNotifications("drawer"));
  };

  const handleLeaveEvent = e => {
    clearDrawerNotifications();

    if (closeCallback) {
      closeCallback(e);
    }

    if (closeUrl) {
      navigate(closeUrl, { state: { noScroll: true } });
    }
  };

  if (lockScroll === "always") {
    return (
      <>
        <Styled.Overlay
          inert={!open ? "" : undefined}
          style={{
            "--z-index": identifier === "toc-drawer" ? 150 : 500
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
  open: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  icon: PropTypes.string,
  identifier: PropTypes.string,
  closeUrl: PropTypes.string,
  closeCallback: PropTypes.func,
  lockScroll: PropTypes.string,
  entrySide: PropTypes.oneOf(["right", "left", "top"]),
  context: PropTypes.oneOf([
    "backend",
    "frontend",
    "reader",
    "editor",
    "ingestion"
  ]),
  size: PropTypes.oneOf(["default", "wide", "flexible", "fixed"]),
  position: PropTypes.oneOf(["default", "overlay"]),
  padding: PropTypes.oneOf(["none", "default", "large", "xl"]),
  includeDrawerFrontMatter: PropTypes.bool,
  returnFocusOnDeactivate: PropTypes.bool,
  focusTrap: PropTypes.bool,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};
