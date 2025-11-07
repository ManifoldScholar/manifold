import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { FocusTrap } from "focus-trap-react";
import { useUID } from "react-uid";
import Header from "./Header";
import helpers from "reader/containers/Annotatable/helpers/selectionHelpers";

import BodyClass from "hoc/BodyClass";

function Overlay({
  open = true,
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
    const dialog = helpers.closest(event.target, "dialog");
    if (dialog) return false;

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
    <BodyClass className={open ? "no-scroll overlay" : ""}>
      <FocusTrap
        active={open}
        focusTrapOptions={{
          escapeDeactivates: e => handleCloseEvent(e),
          fallbackFocus: overlayRef
        }}
      >
        <div
          className={appearance || "overlay-full"}
          ref={overlayRef}
          id={id}
          role="dialog"
          aria-modal
          aria-labelledby={headerId}
          inert={!open ? "" : undefined}
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
        </div>
      </FocusTrap>
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
