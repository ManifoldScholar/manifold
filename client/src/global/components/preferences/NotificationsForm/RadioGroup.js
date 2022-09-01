import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useUIDSeed } from "react-uid";
import classNames from "classnames";

function RadioGroup({ preference, value, options, onChange, inputProps = {} }) {
  const uidSeed = useUIDSeed();
  const { t } = useTranslation();

  if (!preference) return null;

  const defaultOptions = { never: t("common.no"), always: t("common.yes") };
  const localizedOptions = options ?? defaultOptions;

  return (
    <fieldset className="subscriptions__radio-group form-input">
      <legend className="subscriptions__legend">{preference.label}</legend>
      {preference.instructions && (
        <span className="instructions">{preference.instructions}</span>
      )}
      {Object.keys(localizedOptions).map(option => {
        const checked = value === option;
        const inputClassNames = classNames("form-toggle", "radio", "inline", {
          checked
        });

        return (
          <label
            id={uidSeed(option)}
            className={inputClassNames}
            key={`${preference.key}-${option}`}
          >
            <input
              type="radio"
              name={preference.key}
              value={option}
              checked={onChange ? checked : undefined}
              onChange={onChange}
              aria-labelledby={uidSeed(option)}
              {...inputProps}
            />
            <span className="toggle-indicator" />
            <span className="toggle-label">{localizedOptions[option]}</span>
          </label>
        );
      })}
    </fieldset>
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
