import { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import HeadContent from "components/global/HeadContent";
import { useLocation } from "react-router";
import { useNotifications } from "hooks";
import SignInUp from "components/global/sign-in-up";
import * as Styled from "./styles";

export default function Login({ isSignUp = false }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { notifications, addNotification } = useNotifications();

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
      addNotification({
        id: "authenticationError",
        level: 2,
        heading: t("errors.access_denied.header"),
        body: t("errors.access_denied.authentication"),
        scope: "authentication"
      });
    }
  }, [location, addNotification, notifications, t]);

  return (
    <>
      <HeadContent title={t("titles.login")} appendDefaultTitle />
      <Styled.Section className="bg-neutral05">
        <h1 className="screen-reader-text">{t("titles.login")}</h1>
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

Login.displayName = "Frontend.Components.Login";

Login.propTypes = {
  isSignUp: PropTypes.bool
};
