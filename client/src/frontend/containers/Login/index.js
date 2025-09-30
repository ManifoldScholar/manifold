import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import withProjectContext from "hoc/withProjectContext";
import SignInUp from "global/components/sign-in-up";
import { useRouteMatch, useLocation, useHistory } from "react-router-dom";
import { useNotification } from "hooks";
import * as Styled from "./styles";

function LoginContainer({ projectBackLink }) {
  const { t } = useTranslation();
  const isSignUp = useRouteMatch("/signup");
  const location = useLocation();
  const history = useHistory();

  const notifiedRef = useRef(false);

  const notifyUnauthorized = useNotification(() => ({
    id: "authorizationError",
    level: 2,
    heading: "Access Denied",
    body: t("errors.authorization"),
    scope: "authentication"
  }));

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectUri = searchParams.get("redirect_uri");
    const shouldNotify = !!redirectUri || !location.state?.postLoginRedirect;

    if (shouldNotify && !notifiedRef.current) {
      notifyUnauthorized();
      notifiedRef.current = true;
    }
  }, [location, history, notifyUnauthorized]);

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
