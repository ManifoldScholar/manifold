import React from "react";
import { Input } from "../../form-inputs";
import { useFormContext } from "react-hook-form";

export default function CreateFormFields({ errors }) {
  const { register } = useFormContext();

  return (
    <>
      <div className="row-1-p">
        <Input
          label="forms.signin_overlay.email"
          errors={errors}
          placeholder="forms.signin_overlay.email"
          {...register("email")}
        />
      </div>
      <div className="row-1-p">
        <Input
          label="forms.signin_overlay.name"
          errors={errors}
          placeholder="forms.signin_overlay.name"
          {...register("name")}
        />
      </div>
      <div className="row-1-p">
        <Input
          type="password"
          label="forms.signin_overlay.password"
          errors={errors}
          placeholder="forms.signin_overlay.password"
          {...register("password")}
        />
      </div>
      <div className="row-1-p">
        <Input
          type="password"
          label="forms.signin_overlay.confirm_password"
          errors={errors}
          placeholder="forms.signin_overlay.confirm_password"
          {...register("passwordConfirmation")}
        />
      </div>
    </>
  );
}
