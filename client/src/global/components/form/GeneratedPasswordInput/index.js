import { useState, useRef, useEffect, useContext, useId } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useFormField } from "hooks";
import Errorable from "global/components/form/Errorable";
import generatePassword from "helpers/passwordGenerator";
import BaseLabel from "../BaseLabel";
import { FormContext } from "helpers/contexts";
import * as Styled from "./styles";

export default function FormGeneratedPasswordInput({
  name,
  focusOnMount = false
}) {
  const id = useId();
  const { t } = useTranslation();
  const inputRef = useRef(null);
  const { set, errors } = useFormField(name);
  const context = useContext(FormContext);
  const styleType = context?.styleType;

  const [password, setPassword] = useState(() => generatePassword());
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (focusOnMount && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnMount]);

  useEffect(() => {
    set(password, false);
  }, [password, set]);

  const togglePassword = event => {
    event.preventDefault();
    setShowPassword(prev => !prev);
  };

  const handlePasswordChange = event => {
    event.preventDefault();
    const value = event.target.value || null;
    setPassword(value);
  };

  const icon = !showPassword ? "eyeClosed32" : "eyeOpen32";
  const inputType = showPassword ? "text" : "password";
  const Input =
    styleType === "primary" ? Styled.PrimaryInput : Styled.SecondaryInput;

  return (
    <Errorable
      name={name}
      errors={errors}
      label={t("forms.password_reset.password")}
      idForError={`generated-password-error-${id}`}
      className="rel"
    >
      <BaseLabel
        id={`generated-password-${id}`}
        label={t("forms.password_reset.password")}
        styleType={styleType}
      />
      <Styled.Toggle onClick={togglePassword} role="button" tabIndex="0">
        <Styled.Icon icon={icon} size="default" />
        <span className="screen-reader-text">
          {showPassword
            ? t("forms.password_reset.hide")
            : t("forms.password_reset.show")}
        </span>
      </Styled.Toggle>
      <Input
        ref={inputRef}
        id={`generated-password-${id}`}
        aria-describedby={`generated-password-error-${id}`}
        type={inputType}
        placeholder={t("forms.password_reset.enter_password")}
        onChange={handlePasswordChange}
        value={password}
      />
    </Errorable>
  );
}

FormGeneratedPasswordInput.displayName = "Form.GeneratedPasswordInput";

FormGeneratedPasswordInput.propTypes = {
  name: PropTypes.string.isRequired,
  focusOnMount: PropTypes.bool
};
