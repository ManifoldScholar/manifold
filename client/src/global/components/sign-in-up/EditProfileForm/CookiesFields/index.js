import React from "react";
import { useTranslation } from "react-i18next";
import humps from "humps";
import RadioGroup from "frontend/components/preferences/RadioGroup";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function CookiesFields({ cookiePrefs, setCookiePrefs }) {
  const { t } = useTranslation();

  const onChange = pref => {
    const newVal = cookiePrefs[pref] === "yes" ? "no" : "yes";
    setCookiePrefs({ ...cookiePrefs, [pref]: newVal });
  };

  const settings = useFromStore("settings", "select");
  const manifoldAnalyticsEnabled = !settings?.attributes?.general
    ?.disableInternalAnalytics;
  const googleAnalyticsEnabled = !!settings?.attributes?.integrations
    ?.gaTrackingId;
  const installationName = settings?.attributes?.general?.installationName;

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
  );
}

CookiesFields.displayName = "Global.SignInUp.CookiesFields";
