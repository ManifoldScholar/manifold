import { useId, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router";
import { FocusTrap } from "focus-trap-react";
import Header from "./Header";
import helpers from "components/reader/Annotatable/helpers/selectionHelpers";

import { useBodyClass } from "hooks";

function Overlay({
  open = true,
  title,
  subtitle,
  icon,
  appearance,
  contentWidth,
  closeCallback,
  closeUrl,
  triggerScrollToTop,
  id,
  children,
  ariaLabel
}) {
  const overlayRef = useRef(null);
  const headerId = useId();
  const navigate = useNavigate();

  function handleCloseEvent(event) {
    const dialog = helpers.closest(event.target, "dialog");
    if (dialog) return false;

    if (closeCallback) {
      closeCallback(event);
    }
    if (closeUrl) {
      setTimeout(() => {
        navigate(closeUrl);
      }, 200);
    }
  }

  useEffect(() => {
    if (!overlayRef.current) return;
    overlayRef.current.scrollTop = 0;
  }, [triggerScrollToTop]);

  useBodyClass(open ? "no-scroll overlay" : undefined);

  return (
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
  );
}

Overlay.displayName = "Global.Overlay";

Overlay.propTypes = {
  open: PropTypes.bool,
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
