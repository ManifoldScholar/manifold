import React from "react";
import { useSettings, useCurrentUser } from "hooks";
import CurrentUserBanner from "./CurrentUser";
import AnonymousUserBanner from "./AnonymousUser";

export default function CookiesBanner() {
  const currentUser = useCurrentUser();
  const settings = useSettings();

  const { manifoldAnalyticsEnabled, googleAnalyticsEnabled } =
    settings?.attributes?.calculated ?? {};

  if (!(manifoldAnalyticsEnabled || googleAnalyticsEnabled)) return null;

  return currentUser ? <CurrentUserBanner /> : <AnonymousUserBanner />;
}

CookiesBanner.displayName = "Global.CookiesBanner";
