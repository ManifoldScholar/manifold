import { useTranslation } from "react-i18next";
import useSettings from "hooks/useSettings";
import Icon from "../Icon";
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
      <Styled.Logo>
        <Icon
          icon="touch64"
          iconSize={40}
          transform="rotate(40deg) translate(-1px, 5px)"
          bgSize={44}
        />
        <span>Add Manifold Links</span>
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
