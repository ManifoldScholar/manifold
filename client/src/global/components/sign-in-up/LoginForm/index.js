import { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFetcher } from "react-router";
import Notifications from "global/containers/Notifications";
import Form from "global/components/form";
import { useRevalidate } from "hooks";
import BrowserCookieHelper from "helpers/cookie/Browser";
import * as Styled from "./styles";
import * as SharedStyles from "../styles";

const cookie = new BrowserCookieHelper();

export default function LoginForm({
  handleViewChange,
  hideOverlay,
  willRedirect
}) {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  const revalidate = useRevalidate();

  const formatData = data => {
    return { email: data.email, password: data.password };
  };

  useEffect(() => {
    if (fetcher.data?.authToken) {
      cookie.write("authToken", fetcher.data.authToken);
      revalidate();
      if (hideOverlay) hideOverlay();
    }
  }, [fetcher.data, hideOverlay, revalidate]);

  return (
    <div>
      {willRedirect && (
        <Styled.NotificationsWrapper>
          <Notifications
            scope="authentication"
            style="drawer"
            animate={false}
            noDismiss
          />
        </Styled.NotificationsWrapper>
      )}
      <div>
        <SharedStyles.Form
          fetcher={fetcher}
          action="/actions/login"
          formatData={formatData}
        >
          <>
            <Form.Header
              label={t("forms.signin_overlay.log_in")}
              styleType="primary"
            />
            <Form.FieldGroup>
              <Form.TextInput
                focusOnMount
                inputType="email"
                name="email"
                id="login-email"
                placeholder={t("forms.signin_overlay.email")}
                inputMode="email"
                label={t("forms.signin_overlay.email")}
                autoComplete="email"
                ariaRequired
              />
              <Form.TextInput
                password
                name="password"
                id="login-password"
                placeholder={t("forms.signin_overlay.password")}
                label={t("forms.signin_overlay.password")}
                autoComplete="current-password"
                ariaRequired
              />
            </Form.FieldGroup>
            <Form.InputError
              errors={
                fetcher.data?.error && fetcher.state !== "loading"
                  ? [{ detail: fetcher.data.error }]
                  : []
              }
            />
            <input
              type="submit"
              className="button-secondary"
              value={t("forms.signin_overlay.log_in")}
            />
          </>
        </SharedStyles.Form>
        <SharedStyles.LinksWrapper>
          <SharedStyles.ViewLink onClick={e => handleViewChange("password", e)}>
            {t("forms.signin_overlay.forgot_password")}
          </SharedStyles.ViewLink>
          <SharedStyles.ViewLink onClick={e => handleViewChange("terms", e)}>
            {t("forms.signin_overlay.need_account")}
          </SharedStyles.ViewLink>
        </SharedStyles.LinksWrapper>
      </div>
    </div>
  );
}

LoginForm.displayName = "Global.SignInUp.LoginForm";

LoginForm.propTypes = {
  handleViewChange: PropTypes.func,
  hideOverlay: PropTypes.func,
  willRedirect: PropTypes.bool
};
