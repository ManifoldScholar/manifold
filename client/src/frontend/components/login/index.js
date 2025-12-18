import { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router";
import { useNotification, useFromStore } from "hooks";
import SignInUp from "global/components/sign-in-up";
import * as Styled from "./styles";

export default function Login({ isSignUp = false }) {
  const { t } = useTranslation();
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
      <Styled.FormContainer className="container">
        <SignInUp.Interface
          showLogout
          defaultView={isSignUp ? "terms" : "login"}
        />
      </Styled.FormContainer>
    </Styled.Section>
  );
}

Login.displayName = "Frontend.Components.Login";

Login.propTypes = {
  isSignUp: PropTypes.bool
};
