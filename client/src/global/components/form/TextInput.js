import { useId } from "react";
import PropTypes from "prop-types";
import isArray from "lodash/isArray";
import BaseInput from "./BaseInput";

export default function FormTextInput({
  password = false,
  inputType,
  join = array => array.join(", "),
  hideValue,
  ...rest
}) {
  const id = useId();

  const renderValue = value => {
    if (!value) return "";
    if (hideValue) return hideValue(value) ? "" : value;
    if (!isArray(value)) return value;
    return join(value);
  };

  const resolvedInputType = inputType ?? (password ? "password" : "text");

  return (
    <BaseInput
      id={`text-input-${id}`}
      idForError={`text-input-error-${id}`}
      idForInstructions={`text-input-instructions-${id}`}
      inputType={resolvedInputType}
      renderValue={renderValue}
      {...rest}
    />
  );
}

FormTextInput.displayName = "Form.TextInput";

FormTextInput.propTypes = {
  placeholder: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string,
  name: PropTypes.string,
  focusOnMount: PropTypes.bool,
  password: PropTypes.bool,
  inputType: PropTypes.string,
  join: PropTypes.func,
  wide: PropTypes.bool,
  disabled: PropTypes.bool,
  buttons: PropTypes.array,
  hideValue: PropTypes.func
};
