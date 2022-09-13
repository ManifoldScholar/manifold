import React, { useCallback } from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";
import { AcceptTermsCheckbox } from "global/components/sign-in-up/form-inputs";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function AnonymousUserBanner() {
  const { t } = useTranslation();

  const settings = useFromStore("settings", "select");
  const { manifoldAnalyticsEnabled, googleAnalyticsEnabled } =
    settings?.attributes?.calculated ?? {};

  const savePrefs = useCallback(
    declineAll => {
      const args = {
        consentManifoldAnalytics: !manifoldAnalyticsEnabled ? null : false,
        consentGoogleAnalytics: !googleAnalyticsEnabled ? null : false
      };
      // save cookies prefs somewhere
    },
    [googleAnalyticsEnabled, manifoldAnalyticsEnabled]
  );

  // check where we save the anonymous prefs to see if we need to render the banner

  return (
    <Styled.Banner>
      <Styled.Inner $wide>
        <Styled.TextWrapper>
          <Styled.Heading>{t("messages.cookies_banner.header")}</Styled.Heading>
          <p>
            <Trans
              i18nKey="messages.cookies_banner.body_annonymous_user"
              components={[<Link to={`/login`} />]}
            />
          </p>
          <Styled.Checkboxes>
            <Styled.CheckboxWrapper>
              <AcceptTermsCheckbox
                label={t("forms.privacy.internal_analytics.label")}
                labelStyle="heading"
              />
              <Styled.Description>
                {t("forms.privacy.internal_analytics.description")}
              </Styled.Description>
            </Styled.CheckboxWrapper>
            <Styled.CheckboxWrapper>
              <AcceptTermsCheckbox
                label={t("forms.privacy.google_analytics.label")}
                labelStyle="heading"
              />
              <Styled.Description>
                {t("forms.privacy.google_analytics.description")}
              </Styled.Description>
            </Styled.CheckboxWrapper>
          </Styled.Checkboxes>
        </Styled.TextWrapper>
        <Styled.ButtonWrapper>
          <button
            onClick={savePrefs}
            className="button-secondary button-secondary--text-white"
          >
            {t("messages.cookies_banner.accept_label_truncated")}
          </button>
          <Styled.WhiteButton
            onClick={() => savePrefs(true)}
            className="button-secondary button-secondary--outlined"
          >
            {t("messages.cookies_banner.decline_button_label")}
          </Styled.WhiteButton>
        </Styled.ButtonWrapper>
      </Styled.Inner>
    </Styled.Banner>
  );
}

AnonymousUserBanner.displayName = "Global.CookiesBanner.AnonymousUserBanner";
