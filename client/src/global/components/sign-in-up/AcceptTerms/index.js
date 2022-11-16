import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import AcceptTermsCheckbox from "./AcceptTermsCheckbox";
import { useFromStore } from "hooks";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function AcceptTerms({ handleViewChange }) {
  const [accepted, setAccepted] = useState(false);
  const { t } = useTranslation();
  const pages = useFromStore("gPages", "select");
  const settings = useFromStore("settings", "select");

  const { attributes } = settings ?? {};
  const installationName = attributes?.general?.installationName;
  const header = attributes?.theme?.stringSignupTermsHeader;
  const textOne = attributes?.theme?.stringSignupTermsOne;
  const textTwo = attributes?.theme?.stringSignupTermsTwo;

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
      <Styled.Header>{header}</Styled.Header>
      {textOne && <Styled.TextBlock>{textOne}</Styled.TextBlock>}
      {textTwo && <Styled.TextBlock>{textTwo}</Styled.TextBlock>}
      <AcceptTermsCheckbox
        onChange={() => setAccepted(!accepted)}
        label={checkboxLabel}
      />
      <Styled.Button
        className="button-secondary button-secondary--with-room"
        disabled={!accepted}
        onClick={() => handleViewChange("create")}
      >
        {t("actions.continue")}
      </Styled.Button>
    </>
  ) : null;
}

AcceptTerms.displayName = "Global.SignInUp.AcceptTerms";

AcceptTerms.propTypes = {
  handleViewChange: PropTypes.func
};
