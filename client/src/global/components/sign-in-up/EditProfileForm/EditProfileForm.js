import React, { useRef, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { meAPI, requests } from "api";
import { entityStoreActions } from "actions";
import lh from "helpers/linkHandler";
import ProfileFormFields from "./ProfileFormFields";
import Greeting from "./Greeting";
import { Button } from "../form";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useFromStore } from "hooks";
import { useTranslation } from "react-i18next";
import { useUID } from "react-uid";
import { useForm, FormProvider } from "react-hook-form";

const { request } = entityStoreActions;

export default function EditProfileForm({ hideSignInUpOverlay, mode }) {
  const response = useFromStore("gAuthenticatedUserUpdate", "select");
  const authentication = useFromStore("authentication");
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const uid = useUID();

  const {
    currentUser: {
      id: userId,
      attributes: { nickname, firstName, lastName, email, avatarStyles }
    }
  } = authentication ?? {};

  const defaultValues = {
    nickname,
    firstName,
    lastName,
    email,
    password: "",
    passwordConfirmation: "",
    avatar: avatarStyles?.smallSquare
      ? { preview: avatarStyles?.smallSquare }
      : null
  };

  const focusRef = useRef();

  const form = useForm({
    criteriaMode: "all",
    defaultValues,
    mode: "onSubmit"
  });

  useEffect(() => {
    if (focusRef.current) focusRef.current.focus();
  }, []);

  useEffect(() => {
    form.reset();
  }, [authentication.authenticating, userId, form]);

  const updateUser = useCallback(
    (data, avatarFileData) => {
      const baseParams = Object.keys(data)
        .filter(name => name !== "avatar")
        .filter(name => !(name === "password" && data.password === ""))
        .reduce((obj, name) => ({ ...obj, [name]: data[name] }), {});

      const avatar = avatarFileData
        ? {
            data: avatarFileData,
            content_type: data.avatar.type,
            filename: data.avatar.name
          }
        : null;
      const removeAvatar = data.avatar === null;

      const params = { ...baseParams, avatar, removeAvatar };

      const { promise } = dispatch(
        request(meAPI.update(params), requests.gAuthenticatedUserUpdate)
      );
      promise.then(() => {
        if (hideSignInUpOverlay) hideSignInUpOverlay();
      });
    },
    [dispatch, hideSignInUpOverlay]
  );

  const processAvatar = useCallback(
    data => {
      if (data.avatar.path) {
        const reader = new FileReader();
        reader.onload = () => {
          updateUser(data, reader.result);
        };
        return reader.readAsDataURL(data.avatar);
      }
      return updateUser(data);
    },
    [updateUser]
  );

  const redirect = route => () => {
    if (hideSignInUpOverlay) hideSignInUpOverlay();
    history.push(lh.link(route));
  };

  const errors = response?.errors ?? [];

  return userId ? (
    <section ref={el => (focusRef.current = el)} className="sign-in-up-update">
      <Greeting
        mode={mode}
        nickname={form.watch("nickname") ?? nickname ?? firstName}
      />
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(processAvatar)}
          tabIndex={-1}
          aria-labelledby={uid}
        >
          <h2 id={uid} className="screen-reader-text">
            {t("forms.signin_overlay.update_sr_title")}
          </h2>
          <ProfileFormFields errors={errors} />
          <div className="row-1-p">
            <div className="form-input form-error">
              <Button
                type="submit"
                label="forms.signin_overlay.submit_update_label"
              />
            </div>
          </div>
        </form>
      </FormProvider>
      <div style={{ marginTop: "65px" }}>
        <Button
          styleType="outline"
          onClick={redirect("subscriptions")}
          label="forms.signin_overlay.notification_settings"
        />
        <Button
          styleType="outline"
          onClick={redirect("subscriptions")}
          label="Privacy Settings"
        />
      </div>
    </section>
  ) : null;
}
