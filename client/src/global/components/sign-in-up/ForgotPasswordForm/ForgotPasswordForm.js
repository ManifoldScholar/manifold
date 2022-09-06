import React, { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { passwordsAPI } from "api";
import { useUID } from "react-uid";
import BaseHookForm from "../BaseHookForm";
import { Input } from "../form-inputs";
import { useNotification } from "hooks";

export default function ForgotPasswordForm({ handleViewChange, hideOverlay }) {
  const { t } = useTranslation();

  const focusRef = useRef();

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
  }, []);

  const notifySuccess = useNotification(email => ({
    level: 0,
    id: "PASSWORD_RESET_SENT",
    heading: t("forms.signin_overlay.send_reset_success", {
      email
    }),
    expiration: 3000
  }));

  const formatData = useCallback(data => {
    return data.email;
  }, []);

  const onSuccess = useCallback(
    (res, data) => {
      notifySuccess(data.email);
      if (hideOverlay) hideOverlay();
    },
    [hideOverlay, notifySuccess]
  );

  const uid = useUID();

  return (
    <div ref={el => (focusRef.current = el)} tabIndex={-1}>
      <BaseHookForm
        apiMethod={passwordsAPI.create}
        ariaLabelledBy={uid}
        onSuccess={onSuccess}
        formatData={formatData}
      >
        {(errors, { register }) => (
          <>
            <h2 id={uid} className="form-heading">
              {t("forms.signin_overlay.reset_password")}
            </h2>
            <div className="row-1-p">
              <Input
                label="forms.signin_overlay.email"
                errors={errors}
                placeholder="forms.signin_overlay.email"
                {...register("email")}
              />
            </div>
            <div className="row-1-p">
              <div className="form-input">
                <input
                  className="button-secondary button-secondary--with-room"
                  type="submit"
                  value={t("forms.signin_overlay.send_password_reset")}
                />
              </div>
            </div>
          </>
        )}
      </BaseHookForm>
      <p className="login-links">
        <button
          onClick={e => handleViewChange("login", e)}
          data-id="show-login"
        >
          {t("forms.signin_overlay.remember_password")}
        </button>
        <button
          onClick={e => handleViewChange("terms", e)}
          data-id="show-create"
        >
          {t("forms.signin_overlay.need_account")}
        </button>
      </p>
    </div>
  );
}
