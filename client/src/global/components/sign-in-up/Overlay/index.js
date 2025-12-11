import React, { useId, useCallback } from "react";
import { useDispatch } from "react-redux";
import { FocusTrap } from "focus-trap-react";
import TrapContent from "./Content";
import { usePreventBodyScroll, useFromStore } from "hooks";
import { uiVisibilityActions } from "actions";
import * as Styled from "./styles";

export default function Overlay() {
  const dispatch = useDispatch();
  const visibility = useFromStore({ path: "ui.transitory.visibility" });
  const active = visibility?.signInUpOverlay ?? false;

  const hideOverlay = useCallback(() => {
    dispatch(uiVisibilityActions.visibilityHide("signInUpOverlay"));
  }, [dispatch]);

  usePreventBodyScroll(active);
  const uid = useId();

  return (
    <FocusTrap
      active={active}
      focusTrapOptions={{
        onDeactivate: hideOverlay
      }}
    >
      <Styled.Dialog
        className="bg-neutral90"
        role="dialog"
        aria-modal
        aria-labelledby={uid}
        inert={!active ? "" : undefined}
      >
        {active && <TrapContent uid={uid} hideOverlay={hideOverlay} />}
      </Styled.Dialog>
    </FocusTrap>
  );
}

Overlay.displayName = "Global.SignInUp.Overlay";
