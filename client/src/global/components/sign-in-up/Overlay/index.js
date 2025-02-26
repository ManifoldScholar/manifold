import React from "react";
import PropTypes from "prop-types";
import { FocusTrap } from "focus-trap-react";
import { useUID } from "react-uid";
import TrapContent from "./Content";
import { usePreventBodyScroll } from "hooks";
import * as Styled from "./styles";

export default function Overlay({ hideOverlay, active = false }) {
  usePreventBodyScroll(active);
  const uid = useUID();

  return (
    <FocusTrap
      active={active}
      focusTrapOptions={{
        onDeactivate: hideOverlay
      }}
    >
      <Styled.Dialog
        role="dialog"
        aria-labelledby={uid}
        inert={!active ? "" : undefined}
      >
        <TrapContent uid={uid} hideOverlay={hideOverlay} />
      </Styled.Dialog>
    </FocusTrap>
  );
}

Overlay.displayName = "Global.SignInUp.Overlay";

Overlay.propTypes = {
  hideOverlay: PropTypes.func
};
