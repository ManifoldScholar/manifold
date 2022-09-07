import React, { useEffect, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { passwordsAPI } from "api";
import { useUID } from "react-uid";
import BaseHookForm from "../BaseHookForm";
import { Input } from "../form-inputs";
import { useNotification } from "hooks";
import * as Styled from "./styles";

export default function ForgotPasswordForm({ handleViewChange, hideOverlay }) {
  const { t } = useTranslation();

  const formRef = useRef();

  useEffect(() => {
    if (formRef.current) formRef.current.focus();
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
    <div>
      <BaseHookForm
        ref={formRef}
        apiMethod={passwordsAPI.create}
        ariaLabelledBy={uid}
        onSuccess={onSuccess}
        formatData={formatData}
      >
        {(errors, { register }) => (
          <>
            <Styled.Header id={uid}>
              {t("forms.signin_overlay.reset_password")}
            </Styled.Header>
            <Input
              label="forms.signin_overlay.email"
              errors={errors}
              placeholder="forms.signin_overlay.email"
              {...register("email")}
            />
            <Styled.Button
              type="submit"
              label="forms.signin_overlay.send_password_reset"
            />
          </>
        )}
      </BaseHookForm>
      <Styled.LinksWrapper>
        <Styled.ViewLink onClick={e => handleViewChange("login", e)}>
          {t("forms.signin_overlay.remember_password")}
        </Styled.ViewLink>
        <Styled.ViewLink onClick={e => handleViewChange("terms", e)}>
          {t("forms.signin_overlay.need_account")}
        </Styled.ViewLink>
      </Styled.LinksWrapper>
    </div>
  );
}
