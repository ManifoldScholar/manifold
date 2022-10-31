import React from "react";
import PropTypes from "prop-types";
import FocusTrap from "focus-trap-react";
import Utility from "global/components/utility";
import CloseButton from "global/components/Overlay/Close";
import Interface from "../Interface";
import { useTranslation } from "react-i18next";
import { useUID } from "react-uid";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

import { usePreventBodyScroll } from "hooks";

export default function Overlay({ hideOverlay }) {
  usePreventBodyScroll();
  const { t } = useTranslation();
  const authentication = useFromStore("authentication");
  const uid = useUID();

  return (
    <Styled.Dialog role="dialog" aria-labelledby={uid}>
      <FocusTrap
        focusTrapOptions={{
          onDeactivate: hideOverlay
        }}
      >
        <Styled.Header>
          <Styled.HeaderInner>
            <Utility.IconComposer size={26} icon="manifoldLogo32" />
            <Styled.SRTitle id={uid}>
              {t("forms.signin_overlay.sr_title")}
            </Styled.SRTitle>
            <CloseButton onClick={hideOverlay} />
          </Styled.HeaderInner>
        </Styled.Header>
        <Styled.Content>
          <Styled.LayoutContainer>
            <Styled.FormContainer>
              <Interface
                hideOverlay={hideOverlay}
                defaultView={authentication?.authenticated ? "update" : "login"}
              />
            </Styled.FormContainer>
          </Styled.LayoutContainer>
        </Styled.Content>
      </FocusTrap>
    </Styled.Dialog>
  );
}

Overlay.displayName = "Global.SignInUp.Overlay";

Overlay.propTypes = {
  hideOverlay: PropTypes.func
};
