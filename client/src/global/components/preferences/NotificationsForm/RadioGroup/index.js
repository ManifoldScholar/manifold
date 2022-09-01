import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useUIDSeed } from "react-uid";
import * as Styled from "./styles";

function RadioGroup({ preference, value, options, onChange, inputProps = {} }) {
  const uidSeed = useUIDSeed();
  const { t } = useTranslation();

  if (!preference) return null;

  const defaultOptions = { never: t("common.no"), always: t("common.yes") };
  const localizedOptions = options ?? defaultOptions;

  return (
    <Styled.Fieldset>
      <Styled.Legend>{preference.label}</Styled.Legend>
      {preference.instructions && (
        <Styled.Instructions className="instructions">
          {preference.instructions}
        </Styled.Instructions>
      )}
      {Object.keys(localizedOptions).map(option => {
        const checked = value === option;

        return (
          <Styled.RadioOption
            id={uidSeed(option)}
            key={`${preference.key}-${option}`}
          >
            <Styled.RadioInput
              type="radio"
              name={preference.key}
              value={option}
              checked={onChange ? checked : undefined}
              onChange={onChange}
              aria-labelledby={uidSeed(option)}
              {...inputProps}
            />
            <Styled.Toggle />
            <Styled.ToggleLabel>{localizedOptions[option]}</Styled.ToggleLabel>
          </Styled.RadioOption>
        );
      })}
    </Styled.Fieldset>
  );
}

RadioGroup.displayName = "NotificationsForm.RadioGroup";

RadioGroup.propTypes = {
  preferences: PropTypes.object,
  options: PropTypes.object,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  inputProps: PropTypes.object
};

export default RadioGroup;
