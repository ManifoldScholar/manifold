import React, { useCallback } from "react";
import actions from "actions/currentUser";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import OAuthOptions from "../oauth/OAuthLoginOptions";
import Notifications from "global/containers/Notifications";
import { useDispatch } from "react-redux";
import {
  handleAuthenticationSuccess,
  handleAuthenticationFailure
} from "store/middleware/currentUserMiddleware";
import Form from "global/components/form";
import { tokensAPI } from "api";
import { useFromStore } from "hooks";
import * as Styled from "./styles";
import * as SharedStyles from "../styles";

export default function LoginForm({
  handleViewChange,
  hideOverlay,
  willRedirect
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const authentication = useFromStore("authentication");
  const error = authentication?.error?.body;

  const formatData = data => {
    dispatch(actions.loginStart());
    return { email: data.email, password: data.password };
  };

  const onSuccess = useCallback(
    (_, res) => {
      const { authToken } = res.meta ?? {};
      if (!authToken) {
        handleAuthenticationFailure(dispatch, {
          status: 500,
          destroyCookie: true
        });
      }
      handleAuthenticationSuccess(dispatch, {
        authToken,
        user: res,
        setCookie: true
      }).then(() => {
        if (hideOverlay) hideOverlay();
      });
    },
    [dispatch, hideOverlay]
  );

  const onError = useCallback(
    err => {
      handleAuthenticationFailure(dispatch, {
        status: err.status,
        destroyCookie: true
      });
    },
    [dispatch]
  );

  return (
    <div>
      {willRedirect && (
        <Styled.NotificationsWrapper>
          <Notifications
            scope="authentication"
            style="drawer"
            animate={false}
          />
        </Styled.NotificationsWrapper>
      )}
      <div>
        <SharedStyles.Form
          name="global-login"
          create={tokensAPI.loginForm}
          onSuccess={onSuccess}
          onError={onError}
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
              />
              <Form.TextInput
                password
                name="password"
                id="login-password"
                placeholder={t("forms.signin_overlay.password")}
                label={t("forms.signin_overlay.password")}
                autoComplete="current-password"
              />
            </Form.FieldGroup>
            {error && <Form.InputError errors={[{ detail: error }]} />}
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
        <OAuthOptions />
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
