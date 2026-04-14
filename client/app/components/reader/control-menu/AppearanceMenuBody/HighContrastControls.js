import { useId } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Section from "./Section";

export default function HighContrastControls({
  highContrast,
  handleHighContrastControl
}) {
  const { t } = useTranslation();
  const uidSeed = useId();

  return (
    <Section
      label={t("reader.menus.appearance.high_contrast")}
      className="appearance-menu__radio-group"
    >
      {[false, true].map(option => (
        <div key={option.toString()} className="appearance-menu__button-group">
          <button
            type="button"
            className={classNames({
              "appearance-menu__button-base": true,
              "appearance-menu__high-contrast": true,
              [`appearance-menu__high-contrast--${
                option ? "high" : "low"
              }`]: true,
              "appearance-menu__high-contrast--active": highContrast === option
            })}
            aria-labelledby={`${uidSeed}-${option.toString()}`}
            aria-pressed={option === highContrast}
            data-value={option}
            onClick={handleHighContrastControl}
          >
            <div
              aria-hidden
              className={`appearance-menu__high-contrast-visual appearance-menu__high-contrast-visual--${
                option ? "high" : "low"
              }`}
            >
              abc
            </div>
          </button>
          <span
            id={`${uidSeed}-${option.toString()}`}
            className="appearance-menu__button-label"
            aria-hidden
          >
            {option
              ? t("reader.menus.appearance.high_contrast_true")
              : t("reader.menus.appearance.high_contrast_false")}
          </span>
        </div>
      ))}
    </Section>
  );
}
