import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useFetcher } from "react-router";
import ProfileFormFields from "./ProfileFormFields";
import Greeting from "./Greeting";
import { useNavigate } from "react-router";
import {
  useCurrentUser,
  useSettings,
  useNotification,
  useRevalidate
} from "hooks";
import { useTranslation } from "react-i18next";
import CookiesFields from "frontend/components/privacy/CookiesForm/CookiesFormFields";
import Form from "global/components/form";
import * as Styled from "./styles";
import * as SharedStyles from "../styles";

export default function EditProfileForm({ hideOverlay, mode }) {
  const currentUser = useCurrentUser();
  const settings = useSettings();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const revalidate = useRevalidate();

  const [cookiePrefs, setCookiePrefs] = useState({
    manifold: "yes",
    google: "yes"
  });

  const manifoldAnalyticsEnabled = !settings?.attributes?.general
    ?.disableInternalAnalytics;
  const googleAnalyticsEnabled = !!settings?.attributes?.integrations
    ?.gaFourTrackingId;

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  const formatAttributes = data => {
    const consentAttrs =
      mode === "new"
        ? {
            consentManifoldAnalytics: !manifoldAnalyticsEnabled
              ? null
              : cookiePrefs.manifold === "yes",
            consentGoogleAnalytics: !googleAnalyticsEnabled
              ? null
              : cookiePrefs.google === "yes"
          }
        : {};
    return {
      ...consentAttrs,
      ...data.attributes
    };
  };

  useEffect(() => {
    if (fetcher.data?.success) {
      notifyUpdate();
      revalidate();
      if (hideOverlay) hideOverlay();
    }
  }, [fetcher.data, notifyUpdate, revalidate, hideOverlay]);

  const redirect = path => () => {
    if (hideOverlay) hideOverlay();
    navigate(path);
  };

  return currentUser ? (
    <div>
      <SharedStyles.Form
        model={currentUser}
        fetcher={fetcher}
        action="/actions/update-profile"
        formatData={formatAttributes}
      >
        <Greeting
          mode={mode}
          warn={!currentUser.attributes.established}
          trusted={currentUser.attributes.trusted}
          userId={currentUser.id}
          hideOverlay={hideOverlay}
        />
        <h2 className="screen-reader-text">
          {t("forms.signin_overlay.update_sr_title")}
        </h2>
        <Form.InputError
          errors={
            fetcher.data?.errors && fetcher.state !== "loading"
              ? fetcher.data.errors
              : []
          }
        />
        <Form.FieldGroup>
          <ProfileFormFields mode={mode} />
        </Form.FieldGroup>
        {mode === "new" && (
          <Styled.CookiesFieldGroup label={t("forms.privacy.cookies")}>
            <CookiesFields
              cookiePrefs={cookiePrefs}
              setCookiePrefs={setCookiePrefs}
              manifoldAnalyticsEnabled={manifoldAnalyticsEnabled}
              googleAnalyticsEnabled={googleAnalyticsEnabled}
            />
          </Styled.CookiesFieldGroup>
        )}
        <input
          className="button-secondary"
          type="submit"
          value={t("forms.signin_overlay.submit_update_label")}
        />
      </SharedStyles.Form>
      <Styled.ButtonGroup>
        <button
          className="button-secondary button-secondary--outlined button-secondary--color-white"
          onClick={redirect("/subscriptions")}
        >
          {t("forms.signin_overlay.notification_settings")}
        </button>
        <button
          className="button-secondary button-secondary--outlined button-secondary--color-white"
          onClick={redirect("/privacy")}
        >
          {t("forms.privacy.title")}
        </button>
      </Styled.ButtonGroup>
    </div>
  ) : null;
}

EditProfileForm.displayName = "Global.SignInUp.EditProfileForm";

EditProfileForm.propTypes = {
  mode: PropTypes.oneOf(["new", "existing"]),
  hideOverlay: PropTypes.func
};
