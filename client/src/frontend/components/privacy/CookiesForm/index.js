import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import CookiesFields from "./CookiesFormFields";
import GlobalForm from "global/containers/form";
import { useFromStore, useNotification } from "hooks";
import * as Styled from "./styles";

export default function CookiesForm() {
  const { t } = useTranslation();
  const settings = useFromStore("settings", "select");

  const manifoldAnalyticsEnabled = !settings?.attributes?.general
    ?.disableInternalAnalytics;
  const googleAnalyticsEnabled = !!settings?.attributes?.integrations
    ?.gaFourTrackingId;

  const { currentUser } = useFromStore("authentication") ?? {};
  const { consentManifoldAnalytics, consentGoogleAnalytics } =
    currentUser.attributes ?? {};

  const [cookiePrefs, setCookiePrefs] = useState({
    manifold: consentManifoldAnalytics ? "yes" : "no",
    google: consentGoogleAnalytics ? "yes" : "no"
  });

  const formatAttributes = () => ({
    consentManifoldAnalytics: !manifoldAnalyticsEnabled
      ? null
      : cookiePrefs.manifold === "yes",
    consentGoogleAnalytics: !googleAnalyticsEnabled
      ? null
      : cookiePrefs.google === "yes"
  });

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  return (
    <GlobalForm.Form
      name="global-authenticated-user-update"
      update={meAPI.update}
      formatData={formatAttributes}
      onSuccess={notifyUpdate}
      groupErrors
    >
      <Styled.FieldGroup label={t("forms.privacy.cookies")}>
        <CookiesFields
          cookiePrefs={cookiePrefs}
          setCookiePrefs={setCookiePrefs}
          manifoldAnalyticsEnabled={manifoldAnalyticsEnabled}
          googleAnalyticsEnabled={googleAnalyticsEnabled}
        />
      </Styled.FieldGroup>
      <Styled.Save
        className="button-secondary"
        type="submit"
        value={t("forms.notifications.submit_label")}
      />
    </GlobalForm.Form>
  );
}

CookiesForm.displayName = "Frontend.Privacy.CookiesForm";
