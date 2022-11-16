import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AcceptTermsCheckbox from "global/components/sign-in-up/AcceptTerms/AcceptTermsCheckbox";
import PropTypes from "prop-types";
import { useFromStore } from "hooks";
import * as Styled from "./styles";

export default function FormEmbedBanner({ declineAll, save, message }) {
  const { t } = useTranslation();

  const [prefs, setPrefs] = useState({ manifold: false, google: false });
  const onChange = pref => setPrefs({ ...prefs, [pref]: !prefs[pref] });

  const settings = useFromStore("settings", "select");
  const { manifoldAnalyticsEnabled, googleAnalyticsEnabled } =
    settings?.attributes?.calculated ?? {};

  return (
    <Styled.Banner>
      <Styled.Inner $wide>
        <Styled.TextWrapper>
          <Styled.Heading>{t("messages.cookies_banner.header")}</Styled.Heading>
          <p dangerouslySetInnerHTML={{ __html: message }} />
          <Styled.Checkboxes>
            {manifoldAnalyticsEnabled && (
              <Styled.CheckboxWrapper>
                <AcceptTermsCheckbox
                  label={t("forms.privacy.internal_analytics.label")}
                  labelStyle="heading"
                  onChange={() => onChange("manifold")}
                />
                <Styled.Description>
                  {t("forms.privacy.internal_analytics.description")}
                </Styled.Description>
              </Styled.CheckboxWrapper>
            )}
            {googleAnalyticsEnabled && (
              <Styled.CheckboxWrapper>
                <AcceptTermsCheckbox
                  label={t("forms.privacy.google_analytics.label")}
                  labelStyle="heading"
                  onChange={() => onChange("google")}
                />
                <Styled.Description>
                  {t("forms.privacy.google_analytics.description")}
                </Styled.Description>
              </Styled.CheckboxWrapper>
            )}
          </Styled.Checkboxes>
        </Styled.TextWrapper>
        <Styled.ButtonWrapper>
          <button
            onClick={() => save(prefs)}
            className="button-secondary button-secondary--text-white"
          >
            {t("messages.cookies_banner.accept_label_truncated")}
          </button>
          <Styled.WhiteButton
            onClick={declineAll}
            className="button-secondary button-secondary--outlined"
          >
            {t("messages.cookies_banner.decline_button_label")}
          </Styled.WhiteButton>
        </Styled.ButtonWrapper>
      </Styled.Inner>
    </Styled.Banner>
  );
}

FormEmbedBanner.displayName = "Global.CookiesBanner.FormEmbed";

FormEmbedBanner.propTypes = {
  declineAll: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  message: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired
};
