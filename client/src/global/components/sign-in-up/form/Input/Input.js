import React, { forwardRef } from "react";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import { useUID } from "react-uid";

function Input(props, ref) {
  const {
    type = "text",
    errors,
    ariaLabel,
    placeholder,
    label,
    name,
    ...inputProps
  } = props;

  const { t } = useTranslation();
  const uid = useUID();
  const id = `${uid}_${name}`;
  const errorId = `${name}_error`;

  return (
    <Form.Errorable
      className="form-input"
      name={`attributes.${name}`}
      errors={errors}
      idForError={errorId}
    >
      {label && <label htmlFor={id}>{t(label)}</label>}
      <input
        id={id}
        ref={ref}
        type={type}
        name={name}
        aria-label={t(ariaLabel)}
        aria-describedby={errorId}
        placeholder={placeholder && t(placeholder)}
        {...inputProps}
      />
    </Form.Errorable>
  );
}

export default forwardRef(Input);
