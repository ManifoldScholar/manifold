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
  const termsLink = termsPage?.attributes.isExternalLink
    ? termsPage.attributes.externalLink
    : `/page/${termsPage?.attributes.slug}`;
  const privacyPolicy = pages?.find(
    p => p.attributes.purpose === "privacy_policy"
  );
  const privacyLink = privacyPolicy?.attributes.isExternalLink
    ? privacyPolicy.attributes.externalLink
    : `/page/${privacyPolicy?.attributes.slug}`;

  const checkboxLabel = privacyPolicy ? (
    <Trans
      i18nKey="forms.signin_overlay.accept_checkbox_label"
      values={{ installationName }}
      components={{
        termsLink: termsPage ? <a href={termsLink}>#</a> : <></>,
        privacyLink: privacyPolicy ? <a href={privacyLink}>#</a> : <></>
      }}
    />
  ) : (
    <Trans
      i18nKey="forms.signin_overlay.accept_checkbox_label_truncated"
      values={{ installationName }}
      components={{
        termsLink: termsPage ? <a href={termsPage}>#</a> : <></>
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
      <Styled.CheckboxWrapper>
        <AcceptTermsCheckbox
          onChange={() => setAccepted(!accepted)}
          label={checkboxLabel}
        />
      </Styled.CheckboxWrapper>
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
