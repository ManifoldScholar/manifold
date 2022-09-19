import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function NarrowBanner({
  message,
  acceptAll,
  settingsLinkProps,
  onClickSettings
}) {
  const { t } = useTranslation();

  return (
    <Styled.Banner>
      <Styled.Inner>
        <Styled.TextWrapper>
          <Styled.Heading>{t("messages.cookies_banner.header")}</Styled.Heading>
          <p>{message}</p>
        </Styled.TextWrapper>
        <Styled.ButtonWrapper>
          <button
            className="button-secondary button-secondary--text-white"
            onClick={acceptAll}
          >
            {t("messages.cookies_banner.accept_button_label")}
          </button>
          <Styled.WhiteButton
            className="button-secondary button-secondary--outlined"
            onClick={onClickSettings}
            {...settingsLinkProps}
          >
            {t("messages.cookies_banner.settings_button_label")}
          </Styled.WhiteButton>
        </Styled.ButtonWrapper>
      </Styled.Inner>
    </Styled.Banner>
  );
}

NarrowBanner.displayName = "Global.CookiesBanner.Narrow";

NarrowBanner.propTypes = {
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  acceptAll: PropTypes.func.isRequired,
  settingsLinkProps: PropTypes.exact({
    as: PropTypes.instanceOf(Link),
    to: PropTypes.string
  }),
  onClickSettings: PropTypes.func
};
