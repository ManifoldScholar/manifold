import { useState, useRef, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import { useFormField } from "hooks";
import Errorable from "global/components/form/Errorable";
import classnames from "classnames";
import isString from "lodash/isString";
import Instructions from "../Instructions";
import BaseLabel from "../BaseLabel";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export default function BaseInput({
  name,
  errorName,
  placeholder,
  instructions,
  label,
  focusOnMount,
  inputType,
  type,
  autoComplete,
  className,
  id,
  idForError,
  idForInstructions,
  renderValue: renderValueProp,
  wide,
  defaultValue,
  required,
  ariaRequired,
  buttons,
  isDisabled,
  onKeyDown,
  colorRef,
  reset,
  resetOnMount,
  value: valueProp,
  onChange: onChangeProp,
  errors: errorsProp
}) {
  const inputRef = useRef(null);
  const timeoutRef = useRef(null);
  const [notification, setNotification] = useState(null);
  const { value, onChange, set, errors: errorsFromField } = useFormField(
    name,
    valueProp,
    onChangeProp
  );
  const errors = errorsProp ?? errorsFromField;
  const context = useContext(FormContext);
  const styleType = context?.styleType;

  const doReset = useCallback(() => {
    onChange({ target: { value: "" } });
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [onChange]);

  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  useEffect(() => {
    if (reset && resetOnMount) {
      doReset();
    }
  }, [reset, resetOnMount, doReset]);

  const notify = message => {
    setNotification(message);
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const renderValue = val => {
    if (!renderValueProp) return val ?? "";
    return renderValueProp(val);
  };

  const renderButtons = btns => {
    const secondary = styleType === "secondary";
    return (
      <Styled.ActionGroup $secondary={secondary}>
        {btns.map(button => (
          <Styled.Action
            $secondary={secondary}
            type="button"
            key={button.label}
            onClick={event =>
              button.onClick(event, inputRef.current, notify, set)
            }
          >
            {button.label}
          </Styled.Action>
        ))}
      </Styled.ActionGroup>
    );
  };

  const InputComponent =
    styleType === "secondary" ? Styled.SecondaryInput : Styled.PrimaryInput;

  const renderInputComponent = () => (
    <InputComponent
      ref={input => {
        inputRef.current = input;
        /* eslint-disable-next-line no-param-reassign */
        if (colorRef) colorRef.current = input;
      }}
      id={id}
      name={name}
      disabled={isDisabled}
      type={inputType ?? type}
      placeholder={placeholder}
      onChange={onChange}
      onKeyDown={e => {
        if (onKeyDown) onKeyDown(e, inputRef.current);
      }}
      value={renderValue(valueProp ?? value)}
      aria-describedby={`${idForError || ""} ${idForInstructions || ""}`}
      autoComplete={autoComplete}
      defaultValue={defaultValue}
      required={required}
      aria-required={ariaRequired}
    />
  );

  const fieldClasses = classnames(className, { wide });
  const Wrapper = buttons ? Styled.WrapperWithActions : Errorable;

  return (
    <Wrapper
      className={buttons ? undefined : fieldClasses}
      name={errorName ?? name}
      errors={errors}
      label={label}
      idForError={idForError}
    >
      <BaseLabel
        id={id}
        label={label}
        hasInstructions={isString(instructions)}
        styleType={styleType}
      />
      {inputType === "color" ? (
        <span className="ColorInput-wrapper">
          {renderInputComponent()}
          <span>{renderValue(value)}</span>
        </span>
      ) : (
        renderInputComponent()
      )}
      {buttons && renderButtons(buttons)}
      {instructions && (
        <Instructions
          instructions={instructions}
          id={idForInstructions}
          withActions={!!buttons}
        />
      )}
      {notification && (
        <>
          {!instructions && <span />}
          <Styled.Notification>{notification}</Styled.Notification>
        </>
      )}
    </Wrapper>
  );
}

BaseInput.displayName = "Form.BaseInput";

BaseInput.propTypes = {
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  errorName: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
  placeholder: PropTypes.string,
  instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  label: PropTypes.string,
  focusOnMount: PropTypes.bool,
  inputType: PropTypes.string,
  type: PropTypes.string,
  autoComplete: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  idForError: PropTypes.string,
  idForInstructions: PropTypes.string,
  renderValue: PropTypes.func,
  wide: PropTypes.bool,
  defaultValue: PropTypes.string,
  required: PropTypes.bool,
  ariaRequired: PropTypes.bool,
  buttons: PropTypes.array,
  isDisabled: PropTypes.bool,
  onKeyDown: PropTypes.func,
  colorRef: PropTypes.object,
  reset: PropTypes.bool,
  resetOnMount: PropTypes.bool,
  onChange: PropTypes.func,
  errors: PropTypes.array
};
