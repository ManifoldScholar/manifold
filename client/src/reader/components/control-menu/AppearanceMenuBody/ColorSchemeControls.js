import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import Section from "./Section";

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

  return (
    <Section
      label={t("reader.menus.appearance.color_scheme")}
      className="appearance-menu__radio-group"
    >
      {COLOR_SCHEME_OPTIONS.map(option => (
        <button
          type="button"
          key={option.value}
          className={classNames({
            "appearance-menu__button-base": true,
            "appearance-menu__color-scheme": true,
            [`appearance-menu__color-scheme--${option.value}`]: true,
            "appearance-menu__color-scheme--active":
              colorScheme === option.value
          })}
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
          <span className="screen-reader-text">{option.label}</span>
        </button>
      ))}
    </Section>
  );
}
