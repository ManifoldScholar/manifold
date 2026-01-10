import { useId } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";

function Toggle({ handleToggle, label, optionOne, optionTwo, selected, t }) {
  const baseId = useId();
  const id = `button-switch-${baseId}`;

  if (!optionOne || !optionTwo) return null;

  const options = [optionOne, optionTwo];
  const unselected = options.find(option => selected !== option.label);
  const unselectedLabel = unselected ? unselected.label : null;

  const renderOption = (option, index) => {
    const isSelected = selected === option.label;
    const optionClasses = classNames({
      radio: true,
      "button-switch-primary__side": true,
      "button-switch-primary__side--selected": isSelected
    });

    return (
      <label
        key={option.label}
        htmlFor={`${id}-${option.label}`}
        className={optionClasses}
      >
        {option.icon && (
          <IconComposer
            icon={option.icon}
            size={30}
            className="button-switch-primary__icon"
          />
        )}
        <span className="button-switch-primary__label">
          {option.translatedLabel ? option.translatedLabel : option.label}
        </span>
        <input
          type="radio"
          id={`${id}-${option.label}`}
          name={id}
          value={option.label}
          checked={isSelected}
          onChange={handleToggle}
          className="button-switch-primary__input"
          tabIndex={index === 0 ? 0 : -1}
        />
      </label>
    );
  };

  return (
    <div role="group" aria-describedby={id} className="button-switch-primary">
      {options.map((option, index) => renderOption(option, index))}
      <span id={id} className="screen-reader-text">
        {t("actions.toggle_to_state", {
          label,
          state: unselectedLabel
        })}
      </span>
    </div>
  );
}

Toggle.displayName = "Utility.Toggle";

Toggle.propTypes = {
  handleToggle: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  optionOne: PropTypes.shape({
    icon: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  optionTwo: PropTypes.shape({
    icon: PropTypes.string,
    label: PropTypes.string
  }).isRequired,
  selected: PropTypes.string,
  t: PropTypes.func
};

export default withTranslation()(Toggle);
