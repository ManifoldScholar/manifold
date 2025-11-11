import { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import withProjectContext from "hoc/withProjectContext";
import SignInUp from "global/components/sign-in-up";
import { useRouteMatch } from "react-router-dom";
import { useLocation } from "react-router-dom-v5-compat";
import { useNotification, useFromStore } from "hooks";
import * as Styled from "./styles";

function LoginContainer({ projectBackLink }) {
  const { t } = useTranslation();
  const isSignUp = useRouteMatch("/signup");
  const location = useLocation();
  const notifications = useFromStore({ path: "notifications.notifications" });

  const notifyUnauthorized = useNotification(() => ({
    id: "authenticationError",
    level: 2,
    heading: t("errors.access_denied.header"),
    body: t("errors.access_denied.authentication"),
    scope: "authentication"
  }));

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const redirectUri = searchParams.get("redirect_uri");
    const hasAuthNotification = notifications.find(
      n => n.scope === "authentication"
    );
    const shouldNotify =
      (!!redirectUri || !!location.state?.postLoginRedirect) &&
      !hasAuthNotification;

    if (shouldNotify) {
      notifyUnauthorized();
    }
  }, [location, notifyUnauthorized, notifications]);

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
