import { useId } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import IconComposer from "global/components/utility/IconComposer";
import { useTranslation } from "react-i18next";

function ColorPicker({ onChange, getModelValue, label }) {
  const { t } = useTranslation();
  const id = useId();

  const groupLabel = label || t("projects.thumbnail.color_picker");

  const avatarColors = [
    {
      value: "primary",
      label: t("projects.thumbnail.green"),
      className: "color-picker__item--primary"
    },
    {
      value: "secondary",
      label: t("projects.thumbnail.gray"),
      className: "color-picker__item--secondary"
    },
    {
      value: "tertiary",
      label: t("projects.thumbnail.blue"),
      className: "color-picker__item--tertiary"
    },
    {
      value: "quaternary",
      label: t("projects.thumbnail.orange"),
      className: "color-picker__item--quaternary"
    },
    {
      value: "quinary",
      label: t("projects.thumbnail.violet"),
      className: "color-picker__item--quinary"
    },
    {
      value: "sentary",
      label: t("projects.thumbnail.white"),
      className: "color-picker__item--sentary"
    }
  ];

  return (
    <div className="color-picker">
      <div className="color-picker__inner">
        <div
          className="color-picker__list"
          role="group"
          aria-label={groupLabel}
        >
          {avatarColors.map(color => {
            const checked =
              getModelValue("attributes[avatarColor]") === color.value;
            const colorClass = color.className ? color.className : "";
            const inputClassNames = classNames(
              "color-picker__item",
              "radio",
              colorClass,
              { checked }
            );
            return (
              <label
                htmlFor={`${id}-${color.value}`}
                className={inputClassNames}
                key={color.value}
              >
                <span className="screen-reader-text">{color.label}</span>
                <input
                  type="radio"
                  value={color.value}
                  id={`${id}-${color.value}`}
                  name={id}
                  checked={checked}
                  onChange={() => onChange(color)}
                  className="color-picker__input"
                />
                <span className="color-picker__indicator" aria-hidden="true">
                  {checked && (
                    <IconComposer
                      icon="checkmark16"
                      size={18.5}
                      className="color-picker__indicator-icon"
                    />
                  )}
                </span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="color-picker__description" aria-hidden="true">
        {t("projects.thumbnail.color_instructions")}
      </div>
    </div>
  );
}

ColorPicker.displayName = "Project.Form.ColorPicker";

ColorPicker.propTypes = {
  onChange: PropTypes.func,
  wrapperClass: PropTypes.string,
  getModelValue: PropTypes.func,
  label: PropTypes.string
};

export default ColorPicker;
