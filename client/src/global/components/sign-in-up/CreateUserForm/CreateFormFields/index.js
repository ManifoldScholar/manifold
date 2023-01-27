import React from "react";
import PropTypes from "prop-types";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";

export default function CreateFormFields() {
  const { t } = useTranslation();

  return (
    <Form.FieldGroup>
      <Form.TextInput
        focusOnMount
        inputType="email"
        name="attributes[email]"
        id="create-email"
        aria-describedby="create-email-error"
        placeholder={t("forms.signin_overlay.email")}
        idForError="create-email-error"
        label={t("forms.signin_overlay.email")}
        autoComplete="email"
      />
      <Form.TextInput
        id="create-name"
        aria-describedby="create-name-error"
        placeholder={t("forms.signin_overlay.name")}
        idForError="create-name-error"
        name="attributes[name]"
        errorName={[
          "attributes[name]",
          "attributes[lastName]",
          "attributes[firstName]"
        ]}
        label={t("forms.signin_overlay.name")}
        autoComplete="name"
      />
      <Form.TextInput
        password
        id="create-password"
        aria-describedby="create-password-error"
        placeholder={t("forms.signin_overlay.password")}
        idForError="create-password-error"
        name="attributes[password]"
        label={t("forms.signin_overlay.password")}
        autoComplete="new-password"
      />
      <Form.TextInput
        password
        id="create-password-confirmation"
        aria-describedby="create-password-confirmation-error"
        placeholder={t("forms.signin_overlay.confirm_password")}
        idForError="create-password-confirmation-error"
        name="attributes[passwordConfirmation]"
        label={t("forms.signin_overlay.confirm_password")}
        autoComplete="new-password"
      />
    </Form.FieldGroup>
  );
}

CreateFormFields.displayName = "Global.SignInUp.CreateUserForm.Fields";
