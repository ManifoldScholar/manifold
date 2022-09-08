import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useUIDSeed } from "react-uid";
import { useFormContext } from "react-hook-form";
import * as Styled from "./styles";

function RadioGroup({ setting, options, defaultValue, inputProps = {} }) {
  const uidSeed = useUIDSeed();
  const { t } = useTranslation();

  const { register } = useFormContext();

  if (!setting) return null;

  const defaultOptions = { never: t("common.no"), always: t("common.yes") };
  const localizedOptions = options ?? defaultOptions;

  return (
    <Styled.Fieldset>
      <Styled.Legend>{setting.label}</Styled.Legend>
      {setting.instructions && (
        <Styled.Instructions className="instructions">
          {setting.instructions}
        </Styled.Instructions>
      )}
      {Object.keys(localizedOptions).map(option => (
        <Styled.RadioOption
          id={uidSeed(option)}
          key={`${setting.key}-${option}`}
        >
          <Styled.RadioInput
            type="radio"
            value={option}
            aria-labelledby={uidSeed(option)}
            defaultValue={defaultValue}
            {...inputProps}
            {...register(setting.key)}
          />
          <Styled.Toggle />
          <Styled.ToggleLabel>{localizedOptions[option]}</Styled.ToggleLabel>
        </Styled.RadioOption>
      ))}
    </Styled.Fieldset>
  );
}

RadioGroup.displayName = "HookForm.RadioGroup";

RadioGroup.propTypes = {
  settings: PropTypes.object,
  options: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  inputProps: PropTypes.object
};

export default RadioGroup;
