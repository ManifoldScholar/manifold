import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function NarrowBanner({
  message,
  acceptAll,
  settingsLinkProps,
  onClickSettings,
  error
}) {
  const { t } = useTranslation();

  return (
    <Styled.Banner>
      <Styled.NarrowInner>
        <Styled.TextWrapper>
          <Styled.Heading>{t("messages.cookies_banner.header")}</Styled.Heading>
          <p dangerouslySetInnerHTML={{ __html: message }} />
        </Styled.TextWrapper>
        <div>
          {error && <Styled.Error>{t("errors.cookies_banner")}</Styled.Error>}
          <Styled.ButtonWrapper>
            <Styled.Button
              className="button-secondary button-secondary--outlined"
              onClick={acceptAll}
            >
              {t("messages.cookies_banner.accept_button_label")}
            </Styled.Button>
            <Styled.Button
              $dull
              className="button-secondary button-secondary--outlined"
              onClick={onClickSettings}
              {...settingsLinkProps}
            >
              {t("messages.cookies_banner.settings_button_label")}
            </Styled.Button>
          </Styled.ButtonWrapper>
        </div>
      </Styled.NarrowInner>
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
