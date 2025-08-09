import classNames from "classnames";
import { useTranslation } from "react-i18next";
import Utility from "global/components/utility";
import Section from "./Section";

const FONT_STYLE_OPTIONS = [
  {
    label: "Serif",
    value: "serif"
  },
  {
    label: "Sans-serif",
    value: "sans-serif"
  }
];

export default function FontControls({
  fontSize,
  typography,
  handleFontStyleControl,
  incrementSizeHandler,
  decrementSizeHandler
}) {
  const { t } = useTranslation();

  const fontSizeIncreasable = fontSize.current < fontSize.max;
  const fontSizeDecreasable = fontSize.current > fontSize.min;
  const serifDisabled = typography.font !== "serif";
  const sansDisabled = typography.font !== "sans-serif";

  const fontSizeButtonClass = classNames(
    "appearance-menu__font-size-button",
    "appearance-menu__primary-hover-button",
    "appearance-menu__button-base"
  );

  return (
    <Section label={t("reader.menus.appearance.font")}>
      <div className="appearance-menu__font-control-group">
        <div className="appearance-menu__font-style-control">
          <fieldset className="appearance-menu__radio-group">
            <legend className="screen-reader-text">
              {t("reader.menus.appearance.font_style")}
            </legend>
            <div className="appearance-menu__radio-stack">
              {FONT_STYLE_OPTIONS.map(option => (
                <label
                  key={option.value}
                  className={classNames({
                    "appearance-menu__button-base": true,
                    "appearance-menu__font-style": true,
                    [`appearance-menu__font-style--${option.value}`]: true,
                    "appearance-menu__font-style--active":
                      typography.font === option.value
                  })}
                >
                  <input
                    value={option.value}
                    name="font-style-radios"
                    type="radio"
                    checked={option.value === typography.font}
                    onChange={handleFontStyleControl}
                    className="appearance-menu__radio-input"
                  />
                  <span className="appearance-menu__radio-label">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="appearance-menu__font-size-control appearance-menu__font-size-control--serif">
          <div
            role="group"
            aria-label={t("reader.menus.appearance.adjust_font")}
          >
            <button
              className={fontSizeButtonClass}
              disabled={serifDisabled}
              aria-disabled={!fontSizeDecreasable}
              onClick={event => {
                if (fontSizeDecreasable) decrementSizeHandler(event);
              }}
            >
              <Utility.IconComposer icon="MinusUnique" size={30} />
              <span className="screen-reader-text">
                {t("reader.menus.appearance.decrease_font")}
              </span>
            </button>
            <button
              className={fontSizeButtonClass}
              disabled={serifDisabled}
              aria-disabled={!fontSizeIncreasable}
              onClick={event => {
                if (fontSizeIncreasable) incrementSizeHandler(event);
              }}
            >
              <Utility.IconComposer icon="PlusUnique" size={30} />
              <span className="screen-reader-text">
                {t("reader.menus.appearance.increase_font")}
              </span>
            </button>
          </div>
        </div>
        <div className="appearance-menu__font-size-control appearance-menu__font-size-control--sans">
          <div>
            <button
              className={fontSizeButtonClass}
              disabled={sansDisabled}
              aria-disabled={!fontSizeDecreasable}
              onClick={event => {
                if (fontSizeDecreasable) decrementSizeHandler(event);
              }}
            >
              <Utility.IconComposer icon="MinusUnique" size={30} />
              <span className="screen-reader-text">
                {t("reader.menus.appearance.decrease_font")}
              </span>
            </button>
            <button
              className={fontSizeButtonClass}
              disabled={sansDisabled}
              aria-disabled={!fontSizeIncreasable}
              onClick={event => {
                if (fontSizeIncreasable) incrementSizeHandler(event);
              }}
            >
              <Utility.IconComposer icon="PlusUnique" size={30} />
              <span className="screen-reader-text">
                {t("reader.menus.appearance.increase_font")}
              </span>
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
}
