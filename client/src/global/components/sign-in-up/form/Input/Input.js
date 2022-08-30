import React from "react";
import Form from "global/components/form";
import { useTranslation } from "react-i18next";
import { useUID } from "react-uid";

export default function Input(props) {
  const {
    name,
    value,
    type = "text",
    errors,
    ariaLabel,
    onChange,
    placeholder,
    label
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
        value={value}
        type={type}
        name={name}
        id={id}
        aria-label={t(ariaLabel)}
        aria-describedby={errorId}
        onChange={onChange}
        placeholder={t(placeholder)}
      />
    </Form.Errorable>
  );
}
