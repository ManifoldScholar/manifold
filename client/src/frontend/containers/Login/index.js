import React from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import withProjectContext from "hoc/withProjectContext";
import SignInUp from "global/components/sign-in-up";
import { useRouteMatch } from "react-router-dom";
import HeadContent from "global/components/HeadContent";
import * as Styled from "./styles";

function LoginContainer({ projectBackLink }) {
  const isSignUp = useRouteMatch("/signup");

  const { t } = useTranslation();

  return (
    <>
      <HeadContent title={t("titles.login")} appendDefaultTitle />
      <Styled.Section className="bg-neutral05">
        <h1 className="screen-reader-text">{t("titles.login")}</h1>
        {projectBackLink}
        <Styled.FormContainer className="container">
          <SignInUp.Interface
            showLogout
            defaultView={isSignUp ? "terms" : "login"}
          />
        </Styled.FormContainer>
      </Styled.Section>
    </>
  );
}

export default withProjectContext(LoginContainer);
