import Utility from "components/global/utility";
import CloseButton from "components/global/Overlay/Close";
import Interface from "../Interface";
import { useTranslation } from "react-i18next";
import { useAuthentication } from "hooks";
import * as Styled from "./styles";

export default function OverlayContent({ uid, hideOverlay }) {
  const { t } = useTranslation();
  const { authenticated } = useAuthentication();

  return (
    <>
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
              defaultView={authenticated ? "update" : "login"}
            />
          </Styled.FormContainer>
        </Styled.LayoutContainer>
      </Styled.Content>
    </>
  );
}

OverlayContent.displayName = "Global.SignInUp.Overlay.Content";
