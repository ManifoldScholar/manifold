import PropTypes from "prop-types";
import classNames from "classnames";
import Utility from "global/components/utility";
import withScreenReaderStatus from "hoc/withScreenReaderStatus";
import { useTranslation } from "react-i18next";
import { doViewTransition } from "utils/domUtils";
import FontControls from "./FontControls";
import ColorSchemeControls from "./ColorSchemeControls";
import HighContrastControls from "./HighContrastControls";
import MarginControls from "./MarginControls";

function AppearanceMenuBody({
  appearance,
  selectFont,
  setColorScheme,
  setHighContrast,
  incrementFontSize,
  decrementFontSize,
  incrementMargins,
  decrementMargins,
  resetTypography,
  className,
  setScreenReaderStatus
}) {
  const { t } = useTranslation();

  const resetMessage = t("reader.menus.appearance.appearance_reset");

  const { typography, colors } = appearance;
  const { font, fontSize, margins } = typography;
  const { colorScheme, highContrast } = colors;

  const resetDisabled =
    font === "serif" &&
    fontSize.current === 3 &&
    margins.current === 1 &&
    colorScheme === "light";

  const marginIncreaseable = margins.current < margins.max;

  const marginDecreasable = margins.current > margins.min;

  const incrementMarginsMessage = marginIncreaseable
    ? t("reader.menus.appearance.margin_size_increased")
    : t("reader.menus.appearance.margin_size_increased_max");

  const decrementMarginsMessage = marginDecreasable
    ? t("reader.menus.appearance.margin_size_decreased")
    : t("reader.menus.appearance.margin_size_decreased_min");

  const incrementFontMessage =
    fontSize.current < fontSize.max
      ? t("reader.menus.appearance.font_size_increased")
      : t("reader.menus.appearance.font_size_increased_max");

  const decrementFontMessage =
    fontSize.current > fontSize.min
      ? t("reader.menus.appearance.font_size_decreased")
      : t("reader.menus.appearance.font_size_decreased_min");

  function resetOptionMessage(appearanceType, option) {
    return t("reader.menus.appearance.reset_option_message", {
      appearanceType,
      option
    });
  }

  const handleFontStyleControl = event => {
    doViewTransition(() => selectFont(event.target.value));
    setScreenReaderStatus(
      resetOptionMessage(t("reader.menus.appearance.font"), event.target.value)
    );
  };

  const handleColorSchemeControl = event => {
    const buttonEl = event.currentTarget;
    const value = buttonEl.dataset.value;
    doViewTransition(() => setColorScheme(value));
    setScreenReaderStatus(
      resetOptionMessage(t("reader.menus.appearance.color_scheme"), value)
    );
  };

  const handleHighContrastControl = () => {
    const value = !highContrast;
    doViewTransition(() => setHighContrast(value));
    setScreenReaderStatus(
      resetOptionMessage(
        t("reader.menus.appearance.high_contrast"),
        value
          ? t("reader.menus.appearance.high_contrast_true")
          : t("reader.menus.appearance.high_contrast_false")
      )
    );
  };

  const incrementSizeHandler = event => {
    event.stopPropagation();
    doViewTransition(() => incrementFontSize());
    setScreenReaderStatus(incrementFontMessage);
  };

  const decrementSizeHandler = event => {
    event.stopPropagation();
    doViewTransition(() => decrementFontSize());
    setScreenReaderStatus(decrementFontMessage);
  };

  const resetHandler = event => {
    event.stopPropagation();
    doViewTransition(() => {
      setColorScheme("light");
      setHighContrast(false);
      resetTypography();
    });
    setScreenReaderStatus(resetMessage);
  };

  const incrementMarginsHandler = event => {
    event.stopPropagation();
    doViewTransition(() => incrementMargins());
    setScreenReaderStatus(incrementMarginsMessage);
  };

  const decrementMarginsHandler = event => {
    event.stopPropagation();
    doViewTransition(() => decrementMargins());
    setScreenReaderStatus(decrementMarginsMessage);
  };

  return (
    <div
      className={classNames("appearance-menu control-menu", {
        [className]: !!className
      })}
    >
      <div className="control-menu__header">
        <h2 className="control-menu__heading">
          {t("reader.menus.appearance.adjust_appearance") + ":"}
        </h2>
      </div>
      <div className="appearance-menu__list">
        <FontControls
          fontSize={fontSize}
          typography={typography}
          handleFontStyleControl={handleFontStyleControl}
          incrementSizeHandler={incrementSizeHandler}
          decrementSizeHandler={decrementSizeHandler}
        />
        <ColorSchemeControls
          colorScheme={colorScheme}
          handleColorSchemeControl={handleColorSchemeControl}
        />
        <HighContrastControls
          highContrast={highContrast}
          handleHighContrastControl={handleHighContrastControl}
        />
        <MarginControls
          marginDecreasable={marginDecreasable}
          marginIncreaseable={marginIncreaseable}
          incrementMarginsHandler={incrementMarginsHandler}
          decrementMarginsHandler={decrementMarginsHandler}
        />
      </div>
      <div>
        <button
          className="control-menu__button"
          aria-disabled={resetDisabled}
          onClick={resetHandler}
        >
          <Utility.IconComposer
            icon="reload24"
            size={32}
            className="appearance-menu__reload-icon"
          />
          <span>{t("reader.menus.appearance.reset_to_defaults")}</span>
        </button>
      </div>
    </div>
  );
}

AppearanceMenuBody.displayName = "ControlMenu.AppearanceMenuBody";

AppearanceMenuBody.propTypes = {
  appearance: PropTypes.object,
  selectFont: PropTypes.func,
  setColorScheme: PropTypes.func,
  setHighContrast: PropTypes.func,
  incrementFontSize: PropTypes.func,
  decrementFontSize: PropTypes.func,
  incrementMargins: PropTypes.func,
  decrementMargins: PropTypes.func,
  resetTypography: PropTypes.func,
  t: PropTypes.func,
  className: PropTypes.string
};

export default withScreenReaderStatus(AppearanceMenuBody);
