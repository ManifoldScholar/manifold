import React from "react";
import PropTypes from "prop-types";
import { oauthActions } from "actions";
import { providerSetting } from "utils/oauth";
import { useFromStore } from "hooks";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import IconComposer from "global/components/utility/IconComposer";
import * as Styled from "./styles";

export default function OAuthProviderButton({ provider, icon }) {
  const { t } = useTranslation();
  const settings = useFromStore("settings", "select");
  const dispatch = useDispatch();
  const providerSettings =
    settings?.attributes?.oauth[providerSetting(provider)] ?? {};
  const enabled = providerSettings.enabled;

  return enabled ? (
    <Styled.Button
      className="button-secondary button-secondary--dark"
      onClick={() => dispatch(oauthActions.prompt(provider))}
      type="button"
    >
      <IconComposer icon={icon} size={26} className="button-secondary__icon" />
      <span className="button-secondary__text">
        {t("forms.signin_overlay.log_in_with_provider", {
          provider
        })}
      </span>
    </Styled.Button>
  ) : null;
}

OAuthProviderButton.displayName = "Global.SignInUp.OAuthProviderButton";

OAuthProviderButton.propTypes = {
  provider: PropTypes.string,
  icon: PropTypes.string
};
