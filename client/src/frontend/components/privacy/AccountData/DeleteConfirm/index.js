import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useApiCallback, useNotification, useFromStore } from "hooks";
import { meAPI } from "api";
import { currentUserActions } from "actions";
import { useDispatch } from "react-redux";
import Form from "global/components/form";
import * as Styled from "./styles";

export default function DeleteConfirm() {
  const { currentUser } = useFromStore("authentication");
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [emailValue, setEmail] = useState("");
  const [mismatch, setMismatch] = useState(false);
  const [errors, setErrors] = useState(null);

  const deleteAccount = useApiCallback(meAPI.destroy, { removes: currentUser });

  const notifyDestroy = useNotification(me => ({
    level: 0,
    id: `USER_DESTROYED_${me.id}`,
    heading: t("forms.privacy.delete.confirmation_header"),
    body: t("forms.privacy.delete.confirmation_body", {
      name: me?.attributes?.fullName
    }),
    expiration: 5000
  }));

  const deleteAndRedirect = useCallback(async () => {
    const res = await deleteAccount();
    if (res?.errors) return setErrors(res.errors);
    notifyDestroy(currentUser);
    dispatch(currentUserActions.logout());
  }, [currentUser, deleteAccount, notifyDestroy, dispatch]);

  const handleDelete = e => {
    e.preventDefault();
    if (!(emailValue === currentUser?.attributes?.email))
      return setMismatch(true);
    setMismatch(false);
    deleteAndRedirect();
  };

  const mismatchErrorFormatted = [
    { detail: t("forms.privacy.delete.email_mismatch_error") }
  ];

  const visibleErrors = mismatch ? mismatchErrorFormatted : errors || [];

  return (
    <Styled.Box>
      <Styled.Header>{t("forms.privacy.delete.confirm_header")}</Styled.Header>
      <Styled.Instructions>
        {t("forms.privacy.delete.confirm_instructions")}
      </Styled.Instructions>
      <Styled.EmailWrapper>
        <Styled.InputWrapper className={mismatch ? "form-error" : undefined}>
          <Styled.EmailInput
            aria-label={t("forms.privacy.delete.email_placeholder")}
            aria-describedby="email-mismatch"
            placeholder={t("forms.privacy.delete.email_placeholder")}
            onChange={e => setEmail(e.target.value)}
          />
        </Styled.InputWrapper>
        <Styled.Button
          className="button-secondary button-secondary--outlined"
          type="button"
          onClick={handleDelete}
        >
          {t("forms.privacy.delete.confirm_button_label")}
        </Styled.Button>
      </Styled.EmailWrapper>
      <Form.InputError errors={visibleErrors} idForError="delete-account" />
    </Styled.Box>
  );
}

DeleteConfirm.displayName = "Frontend.Privacy.Account.DeleteConfirm";
