import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import { useUID } from "react-uid";
import Header from "./Header";

import BodyClass from "hoc/BodyClass";

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
  id,
  children,
  ariaLabel
}) {
  const overlayRef = useRef(null);
  const headerId = useUID();

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
        id={id}
        role="dialog"
        aria-modal
        aria-labelledby={headerId}
      >
        <FocusTrap
          focusTrapOptions={{
            escapeDeactivates: e => handleCloseEvent(e)
          }}
        >
          <div>
            <Header
              title={title}
              subtitle={subtitle}
              ariaLabel={ariaLabel}
              icon={icon}
              onCloseClick={handleCloseEvent}
              headerId={headerId}
            />
            <div style={{ maxWidth: contentWidth }} className="container">
              {children}
            </div>
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
  triggerScrollToTop: PropTypes.any,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ariaLabel: PropTypes.string
};

export default Overlay;
