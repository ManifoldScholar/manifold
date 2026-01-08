import { useId, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Errorable from "global/components/form/Errorable";
import Option from "../Radio/Option";
import RadioLabel from "../Radio/Label";
import classnames from "classnames";
import Instructions from "../Instructions";
import { useFormField } from "hooks";
import * as Styled from "./styles";

export default function FormRadios({
  options,
  label,
  prompt,
  inline = false,
  name,
  value: valueProp,
  onChange: onChangeProp,
  beforeOnChange,
  inputClasses,
  instructions,
  focusOnMount = false,
  wide,
  errorName,
  idForError,
  errors: errorsProp,
  defaultValue
}) {
  const id = useId();

  // Create a map of stringified values to original values for type conversion
  const valueMap = useMemo(() => {
    const map = new Map();
    options.forEach(option => {
      map.set(String(option.value), option.value);
    });
    return map;
  }, [options]);

  // Transform function to convert string values back to original types
  const transformValue = useCallback(
    stringValue => {
      return stringValue === null
        ? null
        : valueMap.get(stringValue) ?? stringValue;
    },
    [valueMap]
  );

  const { value, onChange, errors } = useFormField(name, {
    controlledValue: valueProp,
    controlledOnChange: onChangeProp,
    controlledErrors: errorsProp,
    beforeOnChange,
    transformValue
  });

  const currentValue = value ?? defaultValue;

  const idPrefix = `radios-${id}`;
  const idForErrorPrefix = idForError || `${idPrefix}-error`;
  const idForInstructionsPrefix = `${idPrefix}-instructions`;

  const inputClassesResolved = classnames(inputClasses, {
    "extra-space-bottom": true,
    wide
  });

  return (
    <Errorable
      className={inputClassesResolved}
      name={errorName ?? name}
      errors={errors}
      label={label}
      idForError={idForErrorPrefix}
    >
      <Styled.RadiosWrapper
        aria-describedby={`${idForErrorPrefix} ${idForInstructionsPrefix}`}
      >
        {(label || prompt) && <RadioLabel label={label} prompt={prompt} />}
        {instructions && (
          <Instructions
            instructions={instructions}
            id={idForInstructionsPrefix}
          />
        )}
        {options.map((option, index) => (
          <Option
            key={option.key || option.value}
            option={option}
            focusOnMount={focusOnMount && index === 0}
            groupName={name || idPrefix}
            value={currentValue}
            onChange={onChange}
            inline={inline}
          />
        ))}
      </Styled.RadiosWrapper>
    </Errorable>
  );
}

FormRadios.displayName = "Form.Radios";

FormRadios.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
      instructions: PropTypes.string,
      key: PropTypes.any
    })
  ).isRequired,
  label: PropTypes.string,
  prompt: PropTypes.string,
  inline: PropTypes.bool,
  name: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  beforeOnChange: PropTypes.func,
  inputClasses: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  focusOnMount: PropTypes.bool,
  wide: PropTypes.bool,
  errorName: PropTypes.string,
  idForError: PropTypes.string,
  errors: PropTypes.array,
  defaultValue: PropTypes.any
};
