import { useTranslation } from "react-i18next";
import useSettings from "hooks/useSettings";
import IconComposer from "global/components/utility/IconComposer";
import Button from "global/components/atomic/Button";
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
      <Styled.Logo to="/lti/deep_linking">
        <IconComposer icon="DeepLinkingLogoUnique" size={44} />
        <span>{t("lti.landing.title")}</span>
      </Styled.Logo>
      <Styled.Instance>
        {settings.attributes.general.installationName}
      </Styled.Instance>
      <Styled.Buttons>
        <Button
          label={t("lti.header.help")}
          preIcon="info16"
          background="outline"
          {...BUTTON_STYLE_PROPS}
        />
        <Button
          label={t("lti.header.my_links")}
          preIcon="link16"
          background="neutral"
          onClick={dialog.onToggleClick}
          {...BUTTON_STYLE_PROPS}
        />
      </Styled.Buttons>
    </Styled.Header>
  );
}
