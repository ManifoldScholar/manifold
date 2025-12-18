import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import CookiesFields from "./CookiesFormFields";
import GlobalForm from "global/containers/form";
import { useSettings, useCurrentUser, useNotification } from "hooks";
import * as Styled from "./styles";

export default function CookiesForm({ submit, errors = [], actionData }) {
  const { t } = useTranslation();
  const settings = useSettings();

  const manifoldAnalyticsEnabled = !settings?.attributes?.general
    ?.disableInternalAnalytics;
  const googleAnalyticsEnabled = !!settings?.attributes?.integrations
    ?.gaFourTrackingId;

  const currentUser = useCurrentUser();
  const { consentManifoldAnalytics, consentGoogleAnalytics } =
    currentUser.attributes ?? {};

  const [cookiePrefs, setCookiePrefs] = useState({
    manifold: consentManifoldAnalytics ? "yes" : "no",
    google: consentGoogleAnalytics ? "yes" : "no"
  });

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  useEffect(() => {
    if (actionData?.success) {
      notifyUpdate();
    }
  }, [actionData?.success, notifyUpdate]);

  const formatData = () => {
    return {
      attributes: {
        consentManifoldAnalytics: !manifoldAnalyticsEnabled
          ? null
          : cookiePrefs.manifold === "yes",
        consentGoogleAnalytics: !googleAnalyticsEnabled
          ? null
          : cookiePrefs.google === "yes"
      }
    };
  };

  return (
    <GlobalForm.Form
      submit={submit}
      errors={errors}
      model={{ attributes: {} }}
      formatData={formatData}
      groupErrors
      className="form-primary"
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

CookiesForm.propTypes = {
  submit: PropTypes.func.isRequired,
  errors: PropTypes.array,
  actionData: PropTypes.object
};
