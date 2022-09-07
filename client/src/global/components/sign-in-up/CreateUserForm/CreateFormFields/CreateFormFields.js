import React from "react";
import { Input } from "../../form-inputs";
import { useFormContext } from "react-hook-form";

export default function CreateFormFields({ errors }) {
  const { register } = useFormContext();

  return (
    <>
      <Input
        label="forms.signin_overlay.email"
        errors={errors}
        placeholder="forms.signin_overlay.email"
        {...register("email")}
      />
      <Input
        label="forms.signin_overlay.name"
        errors={errors}
        placeholder="forms.signin_overlay.name"
        {...register("name")}
      />
      <Input
        type="password"
        label="forms.signin_overlay.password"
        errors={errors}
        placeholder="forms.signin_overlay.password"
        {...register("password")}
      />
      <Input
        type="password"
        label="forms.signin_overlay.confirm_password"
        errors={errors}
        placeholder="forms.signin_overlay.confirm_password"
        {...register("passwordConfirmation")}
      />
    </>
  );
}
