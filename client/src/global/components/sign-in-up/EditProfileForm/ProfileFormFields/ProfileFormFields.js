import React from "react";
import { useTranslation } from "react-i18next";
import { Input, AvatarDropzone } from "../../form";

export default function ProfileFormFields(props) {
  const {
    errors,
    handleInputChange,
    handleFileDrop,
    getAvatarUrl,
    handleRemoveAvatar,
    state
  } = props;

  const { t } = useTranslation();

  return (
    <div className="row-1-p">
      <div className="row-1-p">
        <Input
          name="nickname"
          value={state?.nickname}
          errors={errors}
          ariaLabel="update nickname"
          onChange={handleInputChange}
          placeholder="forms.signin_overlay.nickname"
        />
      </div>
      <AvatarDropzone
        handleFileDrop={handleFileDrop}
        handleRemoveAvatar={handleRemoveAvatar}
        avatarUrl={getAvatarUrl()}
        errors={errors}
      />
      <div className="row-1-p">
        <p className="overlay-copy">{t("forms.signin_overlay.edit_account")}</p>
        <Input
          name="firstName"
          label="forms.signin_overlay.first_name"
          value={state?.firstName}
          errors={errors}
          onChange={handleInputChange}
          placeholder="forms.signin_overlay.first_name"
        />
        <Input
          name="lastName"
          label="forms.signin_overlay.last_name"
          value={state?.lastName}
          errors={errors}
          onChange={handleInputChange}
          placeholder="forms.signin_overlay.last_name"
        />
        <Input
          name="email"
          label="forms.signin_overlay.email"
          value={state?.email}
          errors={errors}
          onChange={handleInputChange}
          placeholder="forms.signin_overlay.email"
        />
        <Input
          name="password"
          type="password"
          label="forms.signin_overlay.new_password"
          value={state?.password}
          errors={errors}
          onChange={handleInputChange}
          placeholder="forms.signin_overlay.new_password"
        />
        <Input
          name="passwordConfirmation"
          type="password"
          label="forms.signin_overlay.confirm_new_password"
          value={state?.password}
          errors={errors}
          onChange={handleInputChange}
          placeholder="forms.signin_overlay.confirm_new_password"
        />
      </div>
    </div>
  );
}
