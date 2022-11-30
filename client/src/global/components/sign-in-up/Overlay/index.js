import React from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import { useUID } from "react-uid";
import TrapContent from "./Content";
import { usePreventBodyScroll } from "hooks";
import * as Styled from "./styles";

export default function Overlay({ hideOverlay }) {
  usePreventBodyScroll();
  const uid = useUID();

  return (
    <Styled.Dialog role="dialog" aria-labelledby={uid}>
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: hideOverlay
        }}
      >
        <TrapContent uid={uid} hideOverlay={hideOverlay} />
      </FocusTrap>
    </Styled.Dialog>
  );
}

Overlay.displayName = "Global.SignInUp.Overlay";

Overlay.propTypes = {
  hideOverlay: PropTypes.func
};
