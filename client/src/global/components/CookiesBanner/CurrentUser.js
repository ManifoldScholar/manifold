import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { useFromStore, useApiCallback } from "hooks";
import { meAPI } from "api";
import * as Styled from "./styles";

export default function CurrentUserBanner() {
  const { t } = useTranslation();
  const { currentUser } = useFromStore("authentication");
  const { consentNeededManifoldAnalytics, consentNeededGoogleAnalytics } =
    currentUser?.attributes ?? {};

  const settings = useFromStore("settings", "select");
  const { manifoldAnalyticsEnabled, googleAnalyticsEnabled } =
    settings?.attributes?.calculated ?? {};

  const acceptCookies = useApiCallback(meAPI.update);

  const acceptAll = useCallback(() => {
    const args = {
      consentManifoldAnalytics: !manifoldAnalyticsEnabled ? null : true,
      consentGoogleAnalytics: !googleAnalyticsEnabled ? null : true
    };
    acceptCookies(args);
  }, [acceptCookies, googleAnalyticsEnabled, manifoldAnalyticsEnabled]);

  if (
    currentUser &&
    !(consentNeededGoogleAnalytics || consentNeededManifoldAnalytics)
  )
    return null;

  return (
    <Styled.Banner>
      <Styled.Inner>
        <Styled.TextWrapper>
          <Styled.Heading>{t("messages.cookies_banner.header")}</Styled.Heading>
          <p>
            <Trans
              i18nKey="messages.cookies_banner.body"
              components={[<Link to={`/privacy`} />]}
            />
          </p>
        </Styled.TextWrapper>
        <Styled.ButtonWrapper>
          <button
            className="button-secondary button-secondary--text-white"
            onClick={acceptAll}
          >
            {t("messages.cookies_banner.accept_button_label")}
          </button>
          <Styled.WhiteButton
            as={Link}
            to="/privacy"
            className="button-secondary button-secondary--outlined"
          >
            {t("messages.cookies_banner.settings_button_label")}
          </Styled.WhiteButton>
        </Styled.ButtonWrapper>
      </Styled.Inner>
    </Styled.Banner>
  );
}

CurrentUserBanner.displayName = "Global.CookiesBanner.CurrentUser";
