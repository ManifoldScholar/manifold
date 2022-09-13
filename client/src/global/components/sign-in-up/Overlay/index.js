import React from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";

import { usePreventBodyScroll } from "hooks";
import OverlayContent from "./OverlayContent";

export default function Overlay({ hideOverlay }) {
  usePreventBodyScroll();

  return (
    <FocusTrap
      focusTrapOptions={{
        onDeactivate: hideOverlay
      }}
    >
      <OverlayContent hideOverlay={hideOverlay} />
    </FocusTrap>
  );
}

Overlay.displayName = "Global.SignInUp.Overlay";

Overlay.propTypes = {
  hideOverlay: PropTypes.func
};
