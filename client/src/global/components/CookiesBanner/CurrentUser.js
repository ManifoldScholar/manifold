import React, { useCallback } from "react";
import { Link } from "react-router-dom";
import { Trans } from "react-i18next";
import { useFromStore, useApiCallback } from "hooks";
import { meAPI } from "api";
import NarrowBanner from "./NarrowBanner";

export default function CurrentUserBanner() {
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

  if (!(consentNeededGoogleAnalytics || consentNeededManifoldAnalytics))
    return null;

  const message = (
    <Trans
      i18nKey="messages.cookies_banner.body"
      components={[<Link to={`/privacy`} />]}
    />
  );

  return (
    <NarrowBanner
      message={message}
      acceptAll={acceptAll}
      settingsLinkProps={{ as: Link, to: "/privacy" }}
    />
  );
}

CurrentUserBanner.displayName = "Global.CookiesBanner.CurrentUser";
