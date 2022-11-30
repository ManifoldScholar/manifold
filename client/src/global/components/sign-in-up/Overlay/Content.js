import React, { forwardRef } from "react";
import Utility from "global/components/utility";
import CloseButton from "global/components/Overlay/Close";
import Interface from "../Interface";
import { useTranslation } from "react-i18next";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

const OverlayContent = ({ uid, hideOverlay }, ref) => {
  const { t } = useTranslation();
  const authentication = useFromStore("authentication");

  return (
    <div ref={ref}>
      <Styled.Header>
        <Styled.HeaderInner>
          <Utility.IconComposer size={26} icon="manifoldLogo32" />
          <h1 className="screen-reader-text" id={uid}>
            {t("forms.signin_overlay.sr_title")}
          </h1>
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
    </div>
  );
};

export default forwardRef(OverlayContent);

OverlayContent.displayName = "Global.SignInUp.Overlay.Content";

OverlayContent.propTypes = {};
