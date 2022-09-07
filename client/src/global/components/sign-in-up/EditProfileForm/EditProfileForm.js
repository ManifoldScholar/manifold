import React, { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { meAPI } from "api";
import lh from "helpers/linkHandler";
import ProfileFormFields from "./ProfileFormFields";
import Greeting from "./Greeting";
import { Button } from "../form-inputs";
import { useHistory } from "react-router-dom";
import { useFromStore, useNotification } from "hooks";
import { useTranslation } from "react-i18next";
import { useUID } from "react-uid";
import BaseHookForm from "../BaseHookForm";
import * as Styled from "./styles";

export default function EditProfileForm({ hideOverlay, mode }) {
  const authentication = useFromStore("authentication");
  const history = useHistory();
  const { t } = useTranslation();
  const uid = useUID();

  const { currentUser } = authentication ?? {};

  const {
    id: userId,
    attributes: { nickname, firstName, lastName, email, avatarStyles } = {}
  } = currentUser ?? {};

  const defaultValues = {
    nickname,
    firstName,
    lastName,
    email,
    password: "",
    passwordConfirmation: "",
    avatar: avatarStyles?.smallSquare
      ? { preview: avatarStyles?.smallSquare }
      : null,
    removeAvatar: false
  };

  const focusRef = useRef();

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
  }, []);

  const notifyUpdate = useNotification(() => ({
    level: 0,
    id: `CURRENT_USER_UPDATED`,
    heading: t("forms.signin_overlay.update_notification_header"),
    expiration: 3000
  }));

  const formatAttributes = useCallback(data => {
    return Object.keys(data)
      .filter(name => !(name === "password" && data.password === ""))
      .reduce((obj, name) => ({ ...obj, [name]: data[name] }), {});
  }, []);

  const onSuccess = useCallback(() => {
    notifyUpdate();
    if (hideOverlay) hideOverlay();
  }, [notifyUpdate, hideOverlay]);

  const redirect = route => () => {
    if (hideOverlay) hideOverlay();
    history.push(lh.link(route));
  };

  return userId ? (
    <div ref={el => (focusRef.current = el)} tabIndex={-1}>
      <BaseHookForm
        defaultValues={defaultValues}
        formatData={formatAttributes}
        ariaLabelledBy={uid}
        onSuccess={onSuccess}
        apiMethod={meAPI.update}
        reset={authentication.authenticating}
      >
        {errors => (
          <>
            <Greeting mode={mode} defaultNickname={nickname ?? firstName} />
            <Styled.SRText id={uid}>
              {t("forms.signin_overlay.update_sr_title")}
            </Styled.SRText>
            <ProfileFormFields errors={errors} />
            <Button
              type="submit"
              label="forms.signin_overlay.submit_update_label"
            />
          </>
        )}
      </BaseHookForm>
      <Styled.ButtonGroup>
        <Button
          styleType="outline"
          onClick={redirect("subscriptions")}
          label="forms.signin_overlay.notification_settings"
        />
        <Button
          styleType="outline"
          onClick={redirect("privacy")}
          label="Privacy Settings"
        />
      </Styled.ButtonGroup>
    </div>
  ) : null;
}