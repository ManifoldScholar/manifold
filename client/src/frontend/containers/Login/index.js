import { useEffect, useRef, useCallback } from "react";
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

  const doNotify = useNotification(path => ({
    id: "authorizationError",
    level: 2,
    heading: "Access Denied",
    body: t("errors.authorization", { path }),
    scope: "authentication"
  }));

  const notifyUnauthorized = useCallback(
    path => {
      if (!notifiedRef.current) {
        doNotify(path);
        notifiedRef.current = true;
      }
    },
    [doNotify]
  );

  useEffect(() => {
    // if (__SERVER__) return;

    if (!location.state?.postLoginRedirect) {
      if (!location?.search) return;
      const searchParams = new URLSearchParams(location.search);
      const redirectUri = searchParams.get("redirect_uri");
      if (!redirectUri) return;
      const withState = {
        ...location,
        state: { ...location.state, postLoginRedirect: redirectUri }
      };
      history.replace(withState);
      notifyUnauthorized(redirectUri);
    } else {
      notifyUnauthorized(location.state?.postLoginRedirect);
    }
  }, [location, history, notifyUnauthorized]);

  console.log(notifiedRef.current);
  console.log(location);

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
