import React from "react";
import { useFromStore } from "hooks";
import CurrentUserBanner from "./CurrentUser";
import AnonymousUserBanner from "./AnonymousUser";

export default function CookiesBanner() {
  const { currentUser } = useFromStore({ path: "authentication" });

  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const { manifoldAnalyticsEnabled, googleAnalyticsEnabled } =
    settings?.attributes?.calculated ?? {};

  if (!(manifoldAnalyticsEnabled || googleAnalyticsEnabled)) return null;

  return currentUser ? <CurrentUserBanner /> : <AnonymousUserBanner />;
}

CookiesBanner.displayName = "Global.CookiesBanner";
