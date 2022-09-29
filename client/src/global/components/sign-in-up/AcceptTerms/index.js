import React, { useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { AcceptTermsCheckbox } from "../form-inputs";
import { useFromStore } from "hooks";
import { Link } from "react-router-dom";
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

  const checkboxLabel = (
    <Trans
      i18nKey="forms.signin_overlay.accept_checkbox_label"
      values={{ installationName }}
      components={{
        termsLink: termsPage ? (
          <Link to={`/page/${termsPage.attributes.slug}`} />
        ) : (
          <></>
        ),
        privacyLink: privacyPolicy ? (
          <Link to={`/page/${privacyPolicy.attributes.slug}`} />
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
        Use this area to describe how Manifold uses your data. Nulla porttitor
        accumsan tincidunt. Vivamus magna justo, lacinia eget consectetur sed,
        convallis at tellus.
      </Styled.TextBlock>
      <Styled.TextBlock>
        Praesent sapien massa, convallis a pellentesque nec, egestas non nisi.
        Nulla quis lorem ut libero malesuada feugiat. Donec rutrum congue leo
        eget malesuada.
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
