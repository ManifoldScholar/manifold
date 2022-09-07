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

export default function LoginForm({
  handleViewChange,
  hideOverlay,
  willRedirect
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const focusRef = useRef();

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
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
        <div style={{ marginBottom: 25 }}>
          <Notifications
            scope="authentication"
            style="drawer"
            animate={false}
          />
        </div>
      )}
      <div ref={el => (focusRef.current = el)} tabIndex={-1}>
        <BaseHookForm
          apiMethod={tokensAPI.loginForm}
          onSuccess={onSuccess}
          onError={onError}
          ariaLabelledBy={uid}
        >
          {errors => (
            <>
              <h2 id={uid} className="form-heading">
                {t("forms.signin_overlay.log_in")}
              </h2>
              <LoginFormFields errors={errors} />
              <div className="row-1-p">
                <div className={errors?.length ? "form-error" : "form-input"}>
                  {errors?.length ? (
                    <span
                      style={{ marginTop: 0 }}
                      role="alert"
                      className="error"
                    >
                      {errors[0]}
                    </span>
                  ) : null}
                  <Button type="submit" label="forms.signin_overlay.log_in" />
                </div>
              </div>
            </>
          )}
        </BaseHookForm>
        <p className="login-links">
          <button
            onClick={e => handleViewChange("password", e)}
            data-id="show-forgot"
          >
            {t("forms.signin_overlay.forgot_password")}
          </button>
          <button
            onClick={e => handleViewChange("terms", e)}
            data-id="show-create"
          >
            {t("forms.signin_overlay.need_account")}
          </button>
        </p>
        <OAuthOptions />
      </div>
    </div>
  );
}
