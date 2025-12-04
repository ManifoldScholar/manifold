import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import config from "config";
import * as Styled from "./styles";

export default function OAuthProviderButton({ provider, icon }) {
  const { t } = useTranslation();

  return (
    <Styled.Button
      className="button-secondary button-secondary--dark"
      href={`${config.services.api}${provider.url}`}
    >
      <IconComposer icon={icon} size={26} className="button-secondary__icon" />
      <span className="button-secondary__text">
        {t("forms.signin_overlay.log_in_with_provider", {
          provider: provider.name
        })}
      </span>
    </Styled.Button>
  );
}

OAuthProviderButton.displayName = "Global.SignInUp.OAuthProviderButton";

OAuthProviderButton.propTypes = {
  provider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  icon: PropTypes.string
};
