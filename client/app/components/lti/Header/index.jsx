import { useTranslation } from "react-i18next";
import useSettings from "hooks/useSettings";
import IconComposer from "components/global/utility/IconComposer";
import Button from "components/global/atomic/Button";
import * as Styled from "./styles";

const BUTTON_STYLE_PROPS = {
  size: "xSm",
  shape: "lozenge",
  lowercase: true
};

export default function LtiHeader({ dialog }) {
  const { t } = useTranslation();
  const settings = useSettings();

  return (
    <Styled.Header>
      <Styled.Logo to="/lti">
        <IconComposer icon="DeepLinkingLogoUnique" size={44} />
        <span>{t("lti.landing.title")}</span>
      </Styled.Logo>
      <Styled.Instance>
        {settings.attributes.general.installationName}
      </Styled.Instance>
      <Styled.Buttons>
        <Button
          label={"Help"}
          preIcon="info16"
          background="outline"
          {...BUTTON_STYLE_PROPS}
        />
        <Button
          label={"My Links"}
          preIcon="rTELink24"
          background="neutral"
          onClick={dialog.onToggleClick}
          aria-label={t("lti.sidebar.open_selected")}
          {...BUTTON_STYLE_PROPS}
        />
      </Styled.Buttons>
    </Styled.Header>
  );
}
