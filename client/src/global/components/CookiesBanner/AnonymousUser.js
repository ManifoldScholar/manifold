import React, { useCallback, useState } from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import NarrowBanner from "./NarrowBanner";
import FormEmbedBanner from "./FormEmbedBanner";
import { useFromStore } from "hooks";

export default function AnonymousUserBanner() {
  const [showForm, setShowForm] = useState(false);

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
      console.info(prefs);
      // save cookies prefs in redux store or local storage
    },
    [googleAnalyticsEnabled, manifoldAnalyticsEnabled]
  );

  // check saved prefs to see if we need to render the banner

  const message = (
    <Trans
      i18nKey="messages.cookies_banner.body_annonymous_user"
      components={[<Link to={`/login`} />]}
    />
  );

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
