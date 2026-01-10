import {
  useRef,
  useEffect,
  useContext,
  useId,
  useCallback,
  useMemo
} from "react";
import PropTypes from "prop-types";
import { useFormField } from "hooks";
import Errorable from "../Errorable";
import Instructions from "../Instructions";
import BaseLabel from "../BaseLabel";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export default function FormSelect({
  name,
  label,
  hideLabel = false,
  instructions,
  rounded = false,
  wide,
  options,
  focusOnMount,
  value: valueProp,
  onChange: onChangeProp,
  errors: errorsProp
}) {
  const id = useId();
  const inputRef = useRef(null);
  const context = useContext(FormContext);
  const styleType = context?.styleType;

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
    transformValue
  });

  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  const idPrefix = `select-${id}`;
  const idForError = `select-error-${id}`;
  const idForInstructions = `select-instructions-${id}`;

  /* eslint-disable no-nested-ternary */
  const WrapperTag = rounded
    ? Styled.TertiarySelectWrapper
    : styleType === "primary"
    ? Styled.PrimarySelectWrapper
    : Styled.SecondarySelectWrapper;

  const SelectComponent = rounded
    ? Styled.TertiarySelect
    : styleType === "primary"
    ? Styled.PrimarySelect
    : Styled.SecondarySelect;

  const IconComponent = rounded ? Styled.IconTertiary : Styled.Icon;

  return (
    <Errorable
      name={name}
      errors={errors}
      label={label}
      idForError={idForError}
    >
      <BaseLabel
        id={idPrefix}
        styleType={rounded ? "tertiary" : styleType}
        label={label}
        className={hideLabel ? "screen-reader-text" : undefined}
        isSelect
      />
      <WrapperTag $wide={wide}>
        <IconComponent icon="disclosureDown24" size={24} />
        <SelectComponent
          id={idPrefix}
          aria-describedby={`${idForError} ${idForInstructions}`}
          onChange={onChange}
          value={value != null ? String(value) : ""}
          ref={inputRef}
          $wide={wide}
        >
          {options.map(option => (
            <option key={option.key} value={String(option.value)}>
              {option.label}
            </option>
          ))}
        </SelectComponent>
      </WrapperTag>
      {instructions && (
        <Instructions
          instructions={instructions}
          id={idForInstructions}
          styleType={rounded ? "tertiary" : styleType}
          label={label}
          isSelect
          className={hideLabel ? "screen-reader-text" : undefined}
        />
      )}
    </Errorable>
  );
}

FormSelect.displayName = "Form.Select";

FormSelect.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  hideLabel: PropTypes.bool,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  rounded: PropTypes.bool,
  wide: PropTypes.bool,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.any.isRequired,
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired
    })
  ).isRequired,
  focusOnMount: PropTypes.bool,
  value: PropTypes.any,
  onChange: PropTypes.func,
  errors: PropTypes.array
};
