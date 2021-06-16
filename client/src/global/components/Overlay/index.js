import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import Header from "./Header";

import BodyClass from "hoc/body-class";

function Overlay({
  title,
  subtitle,
  icon,
  appearance,
  contentWidth,
  closeCallback,
  closeUrl,
  history,
  triggerScrollToTop,
  children
}) {
  const overlayRef = useRef(null);

  function handleCloseEvent(event) {
    if (closeCallback) {
      closeCallback(event);
    }
    if (closeUrl) {
      setTimeout(() => {
        history.push(closeUrl);
      }, 200);
    }
  }

  function handleEscape(event) {
    if (event.keyCode === 27) {
      handleCloseEvent(event);
    }
  }

  useEffect(() => {
    window.addEventListener("keyup", handleEscape);

    return () => {
      window.removeEventListener("keyup", handleEscape);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.scrollTop = 0;
  }, [triggerScrollToTop]);

  return (
    <BodyClass className="no-scroll overlay">
      <div
        className={appearance || "overlay-full"}
        key="globalOverlay"
        ref={overlayRef}
      >
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: false
          }}
        >
          <Header
            title={title}
            subtitle={subtitle}
            icon={icon}
            onCloseClick={handleCloseEvent}
          />
          <div style={{ maxWidth: contentWidth }} className="container">
            {children}
          </div>
        </FocusTrap>
      </div>
    </BodyClass>
  );
}

Overlay.displayName = "Global.Overlay";

Overlay.propTypes = {
  open: PropTypes.bool,
  history: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.string,
  closeUrl: PropTypes.string,
  closeCallback: PropTypes.func,
  contentWidth: PropTypes.number,
  appearance: PropTypes.string,
  triggerScrollToTop: PropTypes.any
};

export default Overlay;
