import { useContext, useId } from "react";
import PropTypes from "prop-types";
import { useFormField } from "hooks";
import { FormContext } from "helpers/contexts";
import Errorable from "../Errorable";
import isString from "lodash/isString";
import Instructions from "../Instructions";
import BaseLabel from "../BaseLabel";
import * as Styled from "./styles";

export default function TextArea({
  name,
  label,
  placeholder,
  height = 100,
  instructions,
  wide,
  required,
  instructionsPosition = "above",
  value: valueProp,
  onChange: onChangeProp,
  errors: errorsProp
}) {
  const id = useId();
  const { value, onChange, errors: errorsFromField } = useFormField(
    name,
    valueProp,
    onChangeProp
  );
  const errors = errorsProp ?? errorsFromField;
  const context = useContext(FormContext);
  const styleType = context?.styleType;

  const TextAreaInput =
    styleType === "secondary"
      ? Styled.TextAreaSecondary
      : Styled.TextAreaPrimary;

  return (
    <Errorable
      name={name}
      errors={errors}
      label={label}
      idForError={`textarea-error-${id}`}
      className={wide ? "wide" : undefined}
    >
      <BaseLabel
        id={`textarea-${id}`}
        hasInstructions={isString(instructions)}
        label={label}
        styleType={styleType}
      />
      {instructions && instructionsPosition !== "below" && (
        <Instructions
          instructions={instructions}
          id={`textarea-instructions-${id}`}
        />
      )}
      <TextAreaInput
        id={`textarea-${id}`}
        name={name}
        aria-describedby={`textarea-error-${id} textarea-instructions-${id}`}
        style={{ height }}
        placeholder={placeholder}
        onChange={onChange}
        value={value || ""}
        required={required}
      />
      {instructions && instructionsPosition === "below" && (
        <Instructions
          instructions={instructions}
          id={`textarea-instructions-${id}`}
        />
      )}
    </Errorable>
  );
}

TextArea.displayName = "Form.TextArea";

TextArea.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  height: PropTypes.number,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  wide: PropTypes.bool,
  required: PropTypes.bool,
  instructionsPosition: PropTypes.oneOf(["above", "below"]),
  value: PropTypes.string,
  onChange: PropTypes.func,
  errors: PropTypes.array
};
