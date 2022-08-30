import React, { useState, useRef, useEffect } from "react";
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

const { request } = entityStoreActions;

export default function EditProfileForm(props) {
  const { hideSignInUpOverlay, mode } = props;

  // state.entityStore.responses[requests.gAuthenticatedUserUpdate]
  const response = useFromStore("gAuthenticatedUserUpdate", "select");
  const authentication = useFromStore("authentication");
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const uid = useUID();

  const { currentUser } = authentication ?? {};

  const formRef = useRef();
  const [formState, setFormState] = useState();

  useEffect(() => {
    if (formRef.current) formRef.current.focus();
  }, []);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const {
      attributes: { nickname, firstName, lastName, email }
    } = currentUser ?? {};

    const defaultValues = {
      nickname,
      firstName,
      lastName,
      email,
      password: "",
      passwordConfirmation: "",
      removeAvatar: false,
      avatar: null
    };

    setFormState(defaultValues);
  }, [authentication.authenticating, currentUser.id]);
  /* eslint-disable react-hooks/exhaustive-deps */

  const handleInputChange = e => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const doUpdateRequest = (avatarData = null) => {
    const baseParams = Object.keys(formState)
      .filter(name => name !== "avatar")
      .filter(name => !(name === "password" && formState.password === ""))
      .reduce((obj, name) => ({ ...obj, [name]: formState[name] }), {});

    const avatar = avatarData
      ? {
          data: avatarData,
          content_type: formState.avatar.type,
          filename: formState.avatar.name
        }
      : null;
    const params = { ...baseParams, avatar };

    const { promise } = dispatch(
      request(meAPI.update(params), requests.gAuthenticatedUserUpdate)
    );
    promise.then(() => {
      hideSignInUpOverlay();
    });
  };

  const updateUser = e => {
    e.preventDefault();
    if (formState.avatar) {
      const reader = new FileReader();
      reader.onload = () => {
        doUpdateRequest(reader.result);
      };
      reader.readAsDataURL(formState.avatar);
    } else {
      doUpdateRequest();
    }
  };

  const handleRemoveAvatar = e => {
    e.preventDefault();
    e.stopPropagation();
    setFormState({ ...formState, avatar: null, removeAvatar: true });
  };

  const handleFileDrop = file => {
    setFormState({ ...formState, avatar: file[0], removeAvatar: false });
  };

  const displayAvatar = () => {
    if (formState?.removeAvatar) return null;
    if (formState?.avatar?.preview) return formState.avatar?.preview;
    if (currentUser?.attributes?.avatarStyles?.smallSquare)
      return currentUser.attributes.avatarStyles.smallSquare;
  };

  const redirect = e => route => {
    e.preventDefault();
    if (hideSignInUpOverlay) hideSignInUpOverlay();
    history.push(lh.link(route));
  };

  const errors = response?.errors ?? [];

  return currentUser ? (
    <section ref={el => (formRef.current = el)} className="sign-in-up-update">
      <Greeting
        mode={mode}
        nickname={
          currentUser?.attributes?.nickname ??
          currentUser?.attributes?.firstName
        }
      />
      <form
        autoComplete="off"
        method="post"
        onSubmit={updateUser}
        tabIndex={-1}
        aria-labelledby={uid}
      >
        <h2 id={uid} className="screen-reader-text">
          {t("forms.signin_overlay.update_sr_title")}
        </h2>
        <ProfileFormFields
          errors={errors}
          state={formState}
          mode={mode}
          handleInputChange={handleInputChange}
          handleFileDrop={handleFileDrop}
          handleRemoveAvatar={handleRemoveAvatar}
          getAvatarUrl={displayAvatar}
        />
        <div className="row-1-p">
          <div className="form-input form-error">
            <Button
              type="submit"
              label="forms.signin_overlay.submit_update_label"
            />
          </div>
        </div>
      </form>
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
