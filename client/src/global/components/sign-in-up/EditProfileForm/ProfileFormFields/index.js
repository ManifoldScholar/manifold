import React from "react";
import { useTranslation } from "react-i18next";
import Form from "global/components/form";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function ProfileFormFields({ mode }) {
  const { t } = useTranslation();

  return (
    <>
      <div>
        <Styled.Text>
          {mode === "new"
            ? t("forms.signin_overlay.familiar_name")
            : t("forms.signin_overlay.update_nickname")}
        </Styled.Text>
        <Form.TextInput
          focusOnMount
          id="update-nickname"
          aria-labelledby="update-nickname-label"
          aria-describedby="update-nickname-error"
          placeholder={t("forms.signin_overlay.nickname")}
          name="attributes[nickname]"
          idForError="update-nickname-error"
          autoComplete="nickname"
        />
      </div>
      {__BROWSER__ ? (
        <Form.Upload
          isUserAvatar
          readFrom="attributes[avatarStyles][smallSquare]"
          name="attributes[avatar]"
          remove="attributes[removeAvatar]"
        />
      ) : null}
      <div>
        <Styled.Text>{t("forms.signin_overlay.edit_account")}</Styled.Text>
        <Form.TextInput
          id="update-firstName"
          aria-describedby="update-firstName-error"
          placeholder={t("forms.signin_overlay.first_name")}
          name="attributes[firstName]"
          idForError="update-firstName-error"
          label={t("forms.signin_overlay.first_name")}
          autoComplete="given-name"
        />
      </div>
      <Form.TextInput
        id="update-lastName"
        aria-describedby="update-lastName-error"
        placeholder={t("forms.signin_overlay.last_name")}
        name="attributes[lastName]"
        idForError="update-lastName-error"
        label={t("forms.signin_overlay.last_name")}
        autoComplete="family-name"
      />
      <Form.TextInput
        inputType="email"
        id="update-email"
        aria-describedby="update-email-error"
        placeholder={t("forms.signin_overlay.email")}
        name="attributes[email]"
        idForError="update-email-error"
        label={t("forms.signin_overlay.email")}
      />
      <Form.TextInput
        password
        id="update-password"
        aria-describedby="update-password-error"
        placeholder={t("forms.signin_overlay.new_password")}
        name="attributes[password]"
        idForError="update-password-error"
        label={t("forms.signin_overlay.password")}
        autoComplete="new-password"
      />
      <Form.TextInput
        password
        id="update-passwordConfirmation"
        aria-describedby="update-passwordConfirmation-error"
        placeholder={t("forms.signin_overlay.confirm_new_password")}
        name="attributes[passwordConfirmation]"
        idForError="update-passwordConfirmation-error"
        label={t("forms.signin_overlay.confirm_password")}
        autoComplete="new-password"
      />
    </>
  );
}

ProfileFormFields.displayName = "Global.SignInUp.EditProfileForm.Fields";

ProfileFormFields.propTypes = {
  mode: PropTypes.string
};
