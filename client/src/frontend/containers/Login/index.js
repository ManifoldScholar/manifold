import React from "react";
import PropTypes from "prop-types";
import withProjectContext from "hoc/withProjectContext";
import SignInUp from "global/components/sign-in-up";
import { useRouteMatch } from "react-router-dom";
import * as Styled from "./styles";

function LoginContainer({ projectBackLink }) {
  const isSignUp = useRouteMatch("/signup");

  return (
    <Styled.Section className="bg-neutral05">
      {projectBackLink}
      <Styled.FormContainer className="container">
        <SignInUp.Interface
          showLogout
          defaultView={isSignUp ? "terms" : "login"}
        />
      </Styled.FormContainer>
    </Styled.Section>
  );
}

export default withProjectContext(LoginContainer);
