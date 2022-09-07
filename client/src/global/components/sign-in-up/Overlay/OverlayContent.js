import React, { forwardRef } from "react";
import Utility from "global/components/utility";
import CloseButton from "global/components/Overlay/Close";
import Interface from "../Interface";
import { useTranslation } from "react-i18next";
import { useUID } from "react-uid";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

const OverlayContent = forwardRef(({ hideOverlay }, ref) => {
  const { t } = useTranslation();
  const authentication = useFromStore("authentication");
  const uid = useUID();

  return (
    <Styled.Dialog ref={ref} role="dialog" aria-labelledby={uid}>
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
    </Styled.Dialog>
  );
});

export default OverlayContent;
