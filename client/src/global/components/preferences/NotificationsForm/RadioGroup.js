import React from "react";
import PropTypes from "prop-types";
import { useUIDSeed } from "react-uid";
import classNames from "classnames";

function RadioGroup({
  preference,
  value,
  options = { never: "No", always: "Yes" },
  onChange,
  inputProps = {}
}) {
  const uidSeed = useUIDSeed();

  if (!preference) return null;

  return (
    <fieldset className="subscriptions__radio-group form-input">
      <legend className="subscriptions__legend">{preference.label}</legend>
      {preference.instructions && (
        <span className="instructions">{preference.instructions}</span>
      )}
      {Object.keys(options).map(option => {
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
              checked={checked}
              onChange={onChange}
              aria-labelledby={uidSeed(option)}
              {...inputProps}
            />
            <span className="toggle-indicator" />
            <span className="toggle-label">{options[option]}</span>
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
  value: PropTypes.string,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  inputProps: PropTypes.object
};

export default RadioGroup;
