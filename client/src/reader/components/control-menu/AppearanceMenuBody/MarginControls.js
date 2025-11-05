import { useTranslation } from "react-i18next";
import classNames from "classnames";
import Utility from "global/components/utility";
import Section from "./Section";

const BUTTON_CLASS = classNames(
  "appearance-menu__margin-button",
  "appearance-menu__button-base"
);

export default function MarginControls({
  marginDecreasable,
  marginIncreaseable,
  incrementMarginsHandler,
  decrementMarginsHandler
}) {
  const { t } = useTranslation();

  return (
    <Section
      label={t("reader.menus.appearance.margins")}
      className="appearance-menu__control-margins"
    >
      <button
        className={BUTTON_CLASS}
        aria-disabled={!marginIncreaseable}
        onClick={event =>
          !marginIncreaseable ? {} : incrementMarginsHandler(event)
        }
      >
        <Utility.IconComposer
          icon="MarginIncreaseUnique"
          className="appearance-menu__menu-icon"
        />
        <span className="screen-reader-text">
          {t("reader.menus.appearance.increase_margin")}
        </span>
      </button>
      <button
        className={BUTTON_CLASS}
        aria-disabled={!marginDecreasable}
        onClick={event =>
          !marginDecreasable ? {} : decrementMarginsHandler(event)
        }
      >
        <Utility.IconComposer
          icon="MarginDecreaseUnique"
          className="appearance-menu__menu-icon"
        />
        <span className="screen-reader-text">
          {t("reader.menus.appearance.decrease_margin")}
        </span>
      </button>
    </Section>
  );
}
