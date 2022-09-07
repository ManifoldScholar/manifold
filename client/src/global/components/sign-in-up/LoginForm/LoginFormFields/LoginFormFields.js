import React from "react";
import { Input } from "../../form-inputs";
import { useFormContext } from "react-hook-form";

export default function LoginFormFields({ errors }) {
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
        type="password"
        label="forms.signin_overlay.password"
        errors={errors}
        placeholder="forms.signin_overlay.password"
        {...register("password")}
      />
    </>
  );
}
