import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import NarrowBanner from "./NarrowBanner";
import FormEmbedBanner from "./FormEmbedBanner";
import { useFromStore } from "hooks";
import CookieHelper from "helpers/cookie/Browser";

const cookie = new CookieHelper();

export default function AnonymousUserBanner() {
  const [showForm, setShowForm] = useState(false);
  const [consentNeeded, setConsentNeeded] = useState(
    !cookie.read("anonAnalyticsConsent")
  );

  const settings = useFromStore("settings", "select");
  const { manifoldAnalyticsEnabled, googleAnalyticsEnabled } =
    settings?.attributes?.calculated ?? {};

  /* eslint-disable no-nested-ternary */
  const savePrefs = useCallback(
    ({ all = null, manifold, google }) => {
      const prefs = {
        consentManifoldAnalytics: !manifoldAnalyticsEnabled
          ? null
          : typeof manifold === "boolean"
          ? manifold
          : all,
        consentGoogleAnalytics: !googleAnalyticsEnabled
          ? null
          : typeof google === "boolean"
          ? google
          : all
      };

      cookie.write("anonAnalyticsConsent", prefs, { expires: 365 });
      setConsentNeeded(false);
    },
    [googleAnalyticsEnabled, manifoldAnalyticsEnabled]
  );

  const message = (
    <Trans
      i18nKey="messages.cookies_banner.body_annonymous_user"
      components={[<Link to={`/login`} />]}
    />
  );

  if (!consentNeeded) return null;

  return showForm ? (
    <FormEmbedBanner
      message={message}
      declineAll={() => savePrefs({ all: false })}
      save={savePrefs}
    />
  ) : (
    <NarrowBanner
      message={message}
      acceptAll={() => savePrefs({ all: true })}
      onClickSettings={() => setShowForm(true)}
    />
  );
}

AnonymousUserBanner.displayName = "Global.CookiesBanner.AnonymousUserBanner";
