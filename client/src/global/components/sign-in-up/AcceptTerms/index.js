import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { AcceptTermsCheckbox } from "../form-inputs";
import { useFromStore } from "hooks";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function AcceptTerms({ handleViewChange }) {
  const [accepted, setAccepted] = useState(false);
  const { t } = useTranslation();
  const pages = useFromStore("gPages", "select");
  const settings = useFromStore("settings", "select");

  const installationName = settings?.attributes?.general?.installationName;
  const termsPage = pages?.find(
    p => p.attributes.purpose === "terms_and_conditions"
  );
  const privacyPolicy = pages?.find(
    p => p.attributes.purpose === "privacy_policy"
  );

  const checkboxLabel = privacyPolicy ? (
    <Trans
      i18nKey="forms.signin_overlay.accept_checkbox_label"
      values={{ installationName }}
      components={{
        termsLink: termsPage ? (
          <a href={`/page/${termsPage.attributes.slug}`}>#</a>
        ) : (
          <></>
        ),
        privacyLink: privacyPolicy ? (
          <a href={`/page/${privacyPolicy.attributes.slug}`}>#</a>
        ) : (
          <></>
        )
      }}
    />
  ) : (
    <Trans
      i18nKey="forms.signin_overlay.accept_checkbox_label_truncated"
      values={{ installationName }}
      components={{
        termsLink: termsPage ? (
          <a href={`/page/${termsPage.attributes.slug}`}>#</a>
        ) : (
          <></>
        )
      }}
    />
  );

  if (!termsPage) {
    handleViewChange("create");
  }

  return termsPage ? (
    <>
      <Styled.Header>{t("forms.signin_overlay.terms_header")}</Styled.Header>
      <Styled.TextBlock>
        When you create an account, we will collect and store your name and email address for account management purposes.
      </Styled.TextBlock>
      <Styled.TextBlock>
        This site will also store the annotations and highlights you create on texts, and it will keep track of content that you've starred. Depending on its configuration, this site may store anonymous data on how the site is being used.
      </Styled.TextBlock>

      <AcceptTermsCheckbox
        onChange={() => setAccepted(!accepted)}
        label={checkboxLabel}
      />
      <Styled.Button
        label={t("actions.continue")}
        disabled={!accepted}
        onClick={() => handleViewChange("create")}
      />
    </>
  ) : null;
}

AcceptTerms.displayName = "Global.SignInUp.AcceptTerms";

AcceptTerms.propTypes = {
  handleViewChange: PropTypes.func
};
