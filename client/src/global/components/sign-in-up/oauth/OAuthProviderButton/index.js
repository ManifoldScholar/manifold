import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useAccountLink } from "hooks";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function OAuthProviderButton({ provider, icon }) {
  const { t } = useTranslation();
  const { token: accountLinkToken } = useAccountLink();

  let href = provider.url;
  if (accountLinkToken) {
    const separator = href.includes("?") ? "&" : "?";
    href += `${separator}account_link_token=${encodeURIComponent(
      accountLinkToken
    )}`;
  }

  return (
    <Styled.Button
      className="button-secondary button-secondary--dark"
      href={href}
    >
      <IconComposer icon={icon} size={26} className="button-secondary__icon" />
      <span className="button-secondary__text">
        {t("forms.signin_overlay.log_in_with_provider", {
          provider: provider.displayName
        })}
      </span>
    </Styled.Button>
  );
}

OAuthProviderButton.displayName = "Global.SignInUp.OAuthProviderButton";

OAuthProviderButton.propTypes = {
  provider: PropTypes.shape({
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired
  }).isRequired,
  icon: PropTypes.string
};
