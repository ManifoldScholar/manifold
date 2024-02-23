import React, { useCallback, useState } from "react";
import PropTypes from "prop-types";
import { meAPI } from "api";
import lh from "helpers/linkHandler";
import ProfileFormFields from "./ProfileFormFields";
import Greeting from "./Greeting";
import { useHistory } from "react-router-dom";
import { useFromStore, useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import CookiesFields from "frontend/components/privacy/CookiesForm/CookiesFormFields";
import Form from "global/components/form";
import * as Styled from "./styles";
import * as SharedStyles from "../styles";

export default function EditProfileForm({ hideOverlay, mode }) {
  const authentication = useFromStore("authentication");
  const history = useHistory();
  const { t } = useTranslation();

  const { currentUser } = authentication ?? {};

  const [cookiePrefs, setCookiePrefs] = useState({
    manifold: "yes",
    google: "yes"
  });

  const settings = useFromStore("settings", "select");
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

  const formatAttributes = useCallback(
    data => {
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
    },
    [mode, cookiePrefs, manifoldAnalyticsEnabled, googleAnalyticsEnabled]
  );

  const updateUser = useCallback((_, data) => {
    return meAPI.update(data);
  }, []);

  const onSuccess = useCallback(() => {
    notifyUpdate();
    if (hideOverlay) hideOverlay();
  }, [notifyUpdate, hideOverlay]);

  const redirect = route => () => {
    if (hideOverlay) hideOverlay();
    history.push(lh.link(route));
  };

  return currentUser ? (
    <div>
      <SharedStyles.Form
        model={currentUser}
        name="global-authenticated-user-update"
        onSuccess={onSuccess}
        formatData={formatAttributes}
        update={updateUser}
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
          onClick={redirect("subscriptions")}
        >
          {t("forms.signin_overlay.notification_settings")}
        </button>
        <button
          className="button-secondary button-secondary--outlined button-secondary--color-white"
          onClick={redirect("privacy")}
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
