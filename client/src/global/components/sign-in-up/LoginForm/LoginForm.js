import React, { useRef, useCallback, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import OAuthOptions from "../oauth/OAuthLoginOptions";
import Notifications from "global/containers/Notifications";
import { useUID } from "react-uid";
import { useDispatch } from "react-redux";
import BaseHookForm from "../BaseHookForm";
import {
  handleAuthenticationSuccess,
  handleAuthenticationFailure
} from "store/middleware/currentUserMiddleware";
import LoginFormFields from "./LoginFormFields";
import { Button } from "../form-inputs";
import { tokensAPI } from "api";
import * as Styled from "./styles";

export default function LoginForm({
  handleViewChange,
  hideOverlay,
  willRedirect
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const formRef = useRef();

  useEffect(() => {
    if (formRef.current) formRef.current.focus();
  }, []);

  const onSuccess = useCallback(
    res => {
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
    res => {
      handleAuthenticationFailure(dispatch, {
        status: res.status,
        destroyCookie: true
      });
    },
    [dispatch]
  );

  const uid = useUID();

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
        <BaseHookForm
          ref={formRef}
          apiMethod={tokensAPI.loginForm}
          onSuccess={onSuccess}
          onError={onError}
          ariaLabelledBy={uid}
        >
          {errors => (
            <>
              <Styled.Header>{t("forms.signin_overlay.log_in")}</Styled.Header>
              <LoginFormFields errors={errors} />
              {errors?.length ? <Styled.Error>{errors[0]}</Styled.Error> : null}
              <Button type="submit" label="forms.signin_overlay.log_in" />
            </>
          )}
        </BaseHookForm>
        <Styled.LinksWrapper>
          <Styled.ViewLink onClick={e => handleViewChange("password", e)}>
            {t("forms.signin_overlay.forgot_password")}
          </Styled.ViewLink>
          <Styled.ViewLink onClick={e => handleViewChange("terms", e)}>
            {t("forms.signin_overlay.need_account")}
          </Styled.ViewLink>
        </Styled.LinksWrapper>
        <OAuthOptions />
      </div>
    </div>
  );
}
