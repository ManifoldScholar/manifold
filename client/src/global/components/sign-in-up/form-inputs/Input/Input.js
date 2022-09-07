import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { useUID } from "react-uid";
import * as Styled from "./styles";

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
    <Styled.Field
      name={`attributes.${name}`}
      errors={errors}
      idForError={errorId}
    >
      {label && <Styled.Label htmlFor={id}>{t(label)}</Styled.Label>}
      <Styled.Input
        id={id}
        ref={ref}
        type={type}
        name={name}
        aria-label={t(ariaLabel)}
        aria-describedby={errorId}
        placeholder={placeholder && t(placeholder)}
        {...inputProps}
      />
    </Styled.Field>
  );
}

export default forwardRef(Input);
