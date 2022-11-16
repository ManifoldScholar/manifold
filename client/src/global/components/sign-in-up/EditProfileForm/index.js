import React, { useRef, useEffect, useCallback, useState } from "react";
import PropTypes from "prop-types";
import { meAPI } from "api";
import lh from "helpers/linkHandler";
import ProfileFormFields from "./ProfileFormFields";
import Greeting from "./Greeting";
import { useHistory } from "react-router-dom";
import { useFromStore, useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import CookiesFields from "./CookiesFields";
import Form from "global/components/form";
import * as Styled from "./styles";
import * as SharedStyles from "../styles";

export default function EditProfileForm({ hideOverlay, mode }) {
  const authentication = useFromStore("authentication");
  const history = useHistory();
  const { t } = useTranslation();

  const { currentUser } = authentication ?? {};
  const { consentManifoldAnalytics, consentGoogleAnalytics } =
    currentUser.attributes ?? {};

  // Strip id from the user data, so the global form treats this as a create call and passes the args meAPI.update needs.
  const { id, ...userModel } = currentUser;

  const [cookiePrefs, setCookiePrefs] = useState({
    manifold: consentManifoldAnalytics ? "yes" : "no",
    google: consentGoogleAnalytics ? "yes" : "no"
  });

  const settings = useFromStore("settings", "select");
  const manifoldAnalyticsEnabled = !settings?.attributes?.general
    ?.disableInternalAnalytics;
  const googleAnalyticsEnabled = !!settings?.attributes?.integrations
    ?.gaTrackingId;

  const formRef = useRef();

  useEffect(() => {
    if (formRef.current) formRef.current.focus();
  }, []);

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  const formatAttributes = useCallback(
    data => {
      return {
        consentManifoldAnalytics: !manifoldAnalyticsEnabled
          ? null
          : cookiePrefs.manifold === "yes",
        consentGoogleAnalytics: !googleAnalyticsEnabled
          ? null
          : cookiePrefs.google === "yes",
        ...data.attributes
      };
    },
    [cookiePrefs, manifoldAnalyticsEnabled, googleAnalyticsEnabled]
  );

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
        ref={formRef}
        model={userModel}
        name="global-authenticated-user-update"
        onSuccess={onSuccess}
        formatData={formatAttributes}
        update={meAPI.update}
      >
        <Greeting mode={mode} />
        <h2 className="screen-reader-text">
          {t("forms.signin_overlay.update_sr_title")}
        </h2>
        <Form.FieldGroup>
          <ProfileFormFields mode={mode} />
        </Form.FieldGroup>
        {mode === "new" && (
          <CookiesFields
            cookiePrefs={cookiePrefs}
            setCookiePrefs={setCookiePrefs}
          />
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
