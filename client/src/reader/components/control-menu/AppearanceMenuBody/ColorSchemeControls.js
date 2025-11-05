import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import Section from "./Section";
import { useId } from "react";

const COLOR_SCHEME_OPTIONS = [
  {
    label: "Light",
    value: "light"
  },
  {
    label: "Dark",
    value: "dark"
  }
];

export default function ColorSchemeControls({
  colorScheme,
  handleColorSchemeControl
}) {
  const { t } = useTranslation();
  const uidSeed = useId();

  return (
    <Section
      label={t("reader.menus.appearance.color_scheme")}
      className="appearance-menu__radio-group"
    >
      {COLOR_SCHEME_OPTIONS.map(option => (
        <div key={option.value} className="appearance-menu__button-group">
          <button
            type="button"
            className={classNames({
              "appearance-menu__button-base": true,
              "appearance-menu__color-scheme": true,
              [`appearance-menu__color-scheme--${option.value}`]: true,
              "appearance-menu__color-scheme--active":
                colorScheme === option.value
            })}
            aria-labelledby={`${uidSeed}-${option.value}`}
            aria-pressed={option.value === colorScheme}
            data-value={option.value}
            onClick={handleColorSchemeControl}
          >
            <div className="appearance-menu__radio-input" />
            <Utility.IconComposer
              icon="CheckUnique"
              size={30}
              className="appearance-menu__color-scheme-icon"
            />
          </button>
          <span
            id={`${uidSeed}-${option.value}`}
            className="appearance-menu__button-label"
            aria-hidden
          >
            {option.label}
          </span>
        </div>
      ))}
    </Section>
  );
}
