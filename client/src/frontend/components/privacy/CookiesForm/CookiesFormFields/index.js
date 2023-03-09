import React from "react";
import PropTypes from "prop-types";
import humps from "humps";
import { useTranslation } from "react-i18next";
import RadioGroup from "frontend/components/preferences/RadioGroup";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function CookiesFormFields({
  cookiePrefs,
  setCookiePrefs,
  manifoldAnalyticsEnabled,
  googleAnalyticsEnabled
}) {
  const { t } = useTranslation();
  const settings = useFromStore("settings", "select");

  const installationName = settings?.attributes?.general?.installationName;

  const showNoCookiesMessage = !(
    manifoldAnalyticsEnabled || googleAnalyticsEnabled
  );

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

  const onChange = pref => {
    const newVal = cookiePrefs[pref] === "yes" ? "no" : "yes";
    setCookiePrefs({ ...cookiePrefs, [pref]: newVal });
  };

  return (
    <>
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
              options={{ yes: t("common.yes"), no: t("common.no") }}
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
              options={{ yes: t("common.yes"), no: t("common.no") }}
              value={cookiePrefs.google}
              onChange={() => onChange("google")}
            />
          )}
        </>
      )}
    </>
  );
}

CookiesFormFields.displayName = "Frontend.Privacy.CookiesForm.Fields";

CookiesFormFields.propTypes = {
  cookiePrefs: PropTypes.object.isRequired,
  setCookiePrefs: PropTypes.func.isRequired,
  manifoldAnalyticsEnabled: PropTypes.bool,
  googleAnalyticsEnabled: PropTypes.bool
};
