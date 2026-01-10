import { useId } from "react";
import PropTypes from "prop-types";
import isNull from "lodash/isNull";
import isUndefined from "lodash/isUndefined";
import * as Styled from "./styles";

export default function FormNumberInput({
  placeholder,
  instructions,
  label,
  name,
  onChange,
  afterChange,
  value,
  focusOnMount = false,
  errors,
  wide,
  ...rest
}) {
  const id = useId();

  const renderValue = val => {
    if (isNull(val) || isUndefined(val)) return "";
    return val;
  };

  return (
    <Styled.NumberInput
      id={`number-input-${id}`}
      idForError={`number-input-error-${id}`}
      idForInstructions={`number-input-instructions-${id}`}
      inputType="number"
      renderValue={renderValue}
      placeholder={placeholder}
      instructions={instructions}
      label={label}
      name={name}
      onChange={onChange}
      value={value}
      focusOnMount={focusOnMount}
      errors={errors}
      wide={wide}
      {...rest}
    />
  );
}

FormNumberInput.displayName = "Form.NumberInput";

FormNumberInput.propTypes = {
  placeholder: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
  afterChange: PropTypes.func,
  value: PropTypes.any,
  focusOnMount: PropTypes.bool,
  errors: PropTypes.array,
  wide: PropTypes.bool
};
