import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { meAPI } from "api";
import humps from "humps";
import RadioGroup from "frontend/components/preferences/RadioGroup";
import GlobalForm from "global/containers/form";
import { useFromStore, useNotification } from "hooks";
import * as Styled from "./styles";

export default function CookiesForm() {
  const { t } = useTranslation();
  const settings = useFromStore("settings", "select");

  const manifoldAnalyticsEnabled = !settings?.attributes?.general
    ?.disableInternalAnalytics;
  const googleAnalyticsEnabled = !!settings?.attributes?.integrations
    ?.gaTrackingId;

  const { currentUser } = useFromStore("authentication") ?? {};
  const { consentManifoldAnalytics, consentGoogleAnalytics } =
    currentUser.attributes ?? {};

  const [cookiePrefs, setCookiePrefs] = useState({
    manifold: consentManifoldAnalytics ? "yes" : "no",
    google: consentGoogleAnalytics ? "yes" : "no"
  });

  const onChange = pref => {
    const newVal = cookiePrefs[pref] === "yes" ? "no" : "yes";
    setCookiePrefs({ ...cookiePrefs, [pref]: newVal });
  };

  const installationName = settings?.attributes?.general?.installationName;

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

  const getLocalized = (prop, strType) => {
    const i18nKey = humps.decamelize(prop, { separator: "_" }).toLowerCase();

    switch (strType) {
      case "label":
        return t(`forms.privacy.${i18nKey}.label`);
      case "description":
        return t(`forms.privacy.${i18nKey}.description`, { defaultValue: "" });
      default:
        return "";
    }
  };

  const showNoCookiesMessage = !(
    manifoldAnalyticsEnabled || googleAnalyticsEnabled
  );

  return (
    <GlobalForm.Form
      name="global-authenticated-user-update"
      update={meAPI.update}
      formatData={formatAttributes}
      onSuccess={notifyUpdate}
    >
      <Styled.FieldGroup label={t("forms.privacy.cookies")}>
        {showNoCookiesMessage ? (
          <Styled.NoAnalyticsMessage>
            {t("forms.privacy.no_analytics_message", {
              name: installationName
            })}
          </Styled.NoAnalyticsMessage>
        ) : (
          <>
            {manifoldAnalyticsEnabled && (
              <RadioGroup
                preference={{
                  key: "manifold",
                  label: getLocalized("internalAnalytics", "label"),
                  instructions: getLocalized("internalAnalytics", "description")
                }}
                options={{ no: t("common.no"), yes: t("common.yes") }}
                value={cookiePrefs.manifold}
                onChange={() => onChange("manifold")}
              />
            )}
            {googleAnalyticsEnabled && (
              <RadioGroup
                preference={{
                  key: "google",
                  label: getLocalized("googleAnalytics", "label"),
                  instructions: getLocalized("googleAnalytics", "description")
                }}
                options={{ no: t("common.no"), yes: t("common.yes") }}
                value={cookiePrefs.google}
                onChange={() => onChange("google")}
              />
            )}
          </>
        )}
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
