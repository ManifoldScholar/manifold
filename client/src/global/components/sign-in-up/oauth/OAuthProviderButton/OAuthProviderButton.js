import React from "react";
import PropTypes from "prop-types";
import { oauthActions } from "actions";
import { providerSetting } from "utils/oauth";
import { useFromStore } from "hooks";
import { useDispatch } from "react-redux";
import { Button } from "../../form-inputs";
import { useTranslation } from "react-i18next";

export default function OAuthProviderButton({ provider, icon }) {
  const { t } = useTranslation();
  const settings = useFromStore("settings", "select");
  const dispatch = useDispatch();
  const providerSettings =
    settings?.attributes?.oauth[providerSetting(provider)] ?? {};
  const enabled = providerSettings.enabled;

  return enabled ? (
    <Button
      styleType="dark"
      onClick={() => dispatch(oauthActions.prompt(provider))}
      icon={icon}
      iconSize={26}
      iconLeft
      label={t("forms.signin_overlay.log_in_with_provider", {
        provider
      })}
    />
  ) : null;
}
