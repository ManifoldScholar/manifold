import { useId } from "react";
import PropTypes from "prop-types";
import * as Styled from "./styles";

export default function ColorInput({ defaultValue, ...props }) {
  const id = useId();

  const renderValue = value => value ?? defaultValue;
  return (
    <Styled.ColorInput
      inputType="color"
      id={`color-input-${id}`}
      idForError={`color-input-error-${id}`}
      idForInstructions={`color-input-instructions-${id}`}
      renderValue={renderValue}
      {...props}
    />
  );
}

ColorInput.displayName = "Form.ColorInput";
