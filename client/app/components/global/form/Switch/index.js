import { useRef, useEffect, useContext, useCallback, useId } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { useFormField } from "hooks";
import Instructions from "../Instructions";
import FieldWrapper from "../FieldWrapper";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export default function FormSwitch({
  name,
  label,
  labelPos = "above",
  className,
  instructions,
  customValues,
  focusOnMount,
  submitOnChange = false,
  wide,
  theme = "default",
  isPrimary,
  disabled,
  collapseProps,
  value: valueProp,
  onChange: onChangeProp
}) {
  const checkboxRef = useRef(null);
  const context = useContext(FormContext);
  const id = useId();

  // Determine if we're in controlled mode
  const isControlled = valueProp !== undefined || onChangeProp !== undefined;

  // Only use form field if name is provided (hooks must be called unconditionally)
  // Pass empty string as fallback to avoid errors in useFormField
  const formField = useFormField(name || "");

  // Use controlled props if provided, otherwise use form field
  const value = isControlled ? valueProp : name ? formField.value : undefined;
  const set = formField.set;

  useEffect(() => {
    if (focusOnMount && checkboxRef.current) {
      checkboxRef.current.focus();
    }
  }, [focusOnMount]);

  const truthy = val => val === true || val === "true";

  const determineChecked = useCallback(
    val => {
      if (customValues) return val === customValues.true;
      return truthy(val);
    },
    [customValues]
  );

  const handleChange = useCallback(
    event => {
      if (isControlled && onChangeProp) {
        // Controlled mode: call the provided onChange
        onChangeProp(event);
      } else {
        // Form field mode: update form state
        if (customValues) {
          const trueValue = customValues.true;
          const falseValue = customValues.false;
          if (value === trueValue) {
            set(falseValue);
          } else {
            set(trueValue);
          }
        } else {
          set(!truthy(value));
        }

        if (submitOnChange && context?.triggerSubmit) {
          context.triggerSubmit();
        }
      }
    },
    [
      isControlled,
      onChangeProp,
      customValues,
      value,
      set,
      submitOnChange,
      context
    ]
  );

  const checked = determineChecked(value);
  const showSwitch = theme === "default";
  const showCheckbox = theme === "checkbox";
  const styleType = context?.styleType;

  const LabelText =
    styleType === "secondary" && !isPrimary
      ? Styled.LabelTextSecondary
      : Styled.LabelTextPrimary;

  const Input = showSwitch ? Styled.InputSwitch : Styled.InputCheckbox;

  const renderSwitchIndicator = () => (
    <Styled.IndicatorSwitchOuter className="toggle-indicator">
      <Styled.IndicatorSwitchInner aria-hidden="true" />
    </Styled.IndicatorSwitchOuter>
  );

  const renderCheckboxIndicator = () => (
    <Styled.IndicatorCheckbox aria-hidden="true">
      <Styled.IconCheckbox icon="checkmark16" size="default" />
    </Styled.IndicatorCheckbox>
  );

  const inputId = `switch-input-${id}`;

  return (
    <FieldWrapper
      className={classNames({
        wide,
        [className]: !!className
      })}
    >
      <Styled.Label
        htmlFor={inputId}
        $inline={labelPos === "inline"}
        $below={labelPos === "below"}
      >
        {(labelPos === "above" || labelPos === "inline") && (
          <LabelText $marginEnd={isPrimary}>{label}</LabelText>
        )}
        <Input
          ref={checkboxRef}
          type="checkbox"
          id={inputId}
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          {...collapseProps}
        />
        {showCheckbox && renderCheckboxIndicator()}
        {showSwitch && renderSwitchIndicator()}
        {labelPos === "below" && <LabelText>{label}</LabelText>}
        {!!instructions && (
          <Instructions
            instructions={instructions}
            className={showCheckbox ? "inline" : undefined}
          />
        )}
      </Styled.Label>
    </FieldWrapper>
  );
}

FormSwitch.displayName = "Form.Switch";

FormSwitch.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  labelPos: PropTypes.oneOf(["above", "below", "inline"]),
  className: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  customValues: PropTypes.shape({
    true: PropTypes.string,
    false: PropTypes.string
  }),
  focusOnMount: PropTypes.bool,
  submitOnChange: PropTypes.bool,
  wide: PropTypes.bool,
  theme: PropTypes.oneOf(["default", "checkbox"]),
  isPrimary: PropTypes.bool,
  disabled: PropTypes.bool,
  collapseProps: PropTypes.object,
  value: PropTypes.bool,
  onChange: PropTypes.func
};
