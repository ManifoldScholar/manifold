import React from "react";
import { useTranslation } from "react-i18next";
import { Input, AvatarDropzone } from "../../form-inputs";
import { useFormContext } from "react-hook-form";

export default function ProfileFormFields({ errors }) {
  const { t } = useTranslation();

  const { register } = useFormContext();

  return (
    <div className="row-1-p">
      <p className="overlay-copy">
        {t("forms.signin_overlay.update_nickname")}
      </p>
      <div className="row-1-p">
        <Input
          errors={errors}
          ariaLabel="update nickname"
          placeholder="forms.signin_overlay.nickname"
          {...register("nickname")}
        />
      </div>
      <AvatarDropzone errors={errors} />
      <div className="row-1-p">
        <p className="overlay-copy">{t("forms.signin_overlay.edit_account")}</p>
        <Input
          label="forms.signin_overlay.first_name"
          errors={errors}
          placeholder="forms.signin_overlay.first_name"
          {...register("firstName")}
        />
        <Input
          label="forms.signin_overlay.last_name"
          errors={errors}
          placeholder="forms.signin_overlay.last_name"
          {...register("lastName")}
        />
        <Input
          label="forms.signin_overlay.email"
          errors={errors}
          placeholder="forms.signin_overlay.email"
          {...register("email")}
        />
        <Input
          type="password"
          label="forms.signin_overlay.new_password"
          errors={errors}
          placeholder="forms.signin_overlay.new_password"
          {...register("password")}
        />
        <Input
          type="password"
          label="forms.signin_overlay.confirm_new_password"
          errors={errors}
          placeholder="forms.signin_overlay.confirm_new_password"
          {...register("passwordConfirmation")}
        />
      </div>
    </div>
  );
}
