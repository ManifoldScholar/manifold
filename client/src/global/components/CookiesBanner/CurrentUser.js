import React, { useCallback, useState } from "react";
import { Link } from "react-router-dom";
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

  const [errors, setErrors] = useState(null);

  const acceptAll = useCallback(async () => {
    const args = {
      consentManifoldAnalytics: !manifoldAnalyticsEnabled ? null : true,
      consentGoogleAnalytics: !googleAnalyticsEnabled ? null : true
    };

    const res = await acceptCookies(args);
    if (res?.errors) {
      setErrors(res.errors);
    }
  }, [acceptCookies, googleAnalyticsEnabled, manifoldAnalyticsEnabled]);

  if (!(consentNeededGoogleAnalytics || consentNeededManifoldAnalytics))
    return null;

  const message = settings?.attributes?.stringCookiesBannerCopyFormatted;

  return (
    <NarrowBanner
      message={message}
      acceptAll={acceptAll}
      settingsLinkProps={{ as: Link, to: "/privacy" }}
      error={!!errors}
    />
  );
}

CurrentUserBanner.displayName = "Global.CookiesBanner.CurrentUser";
