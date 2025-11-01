import { useTranslation } from "react-i18next";
import { Toggle } from "global/components/form/Switch/ToggleOnly";
import Section from "./Section";
import { useId } from "react";

export default function HighContrastControls({
  highContrast,
  handleHighContrastControl
}) {
  const { t } = useTranslation();
  const labelId = useId();

  return (
    <Section
      label={t("reader.menus.appearance.high_contrast")}
      labelId={labelId}
      className="appearance-menu__radio-group"
    >
      <button
        className="appearance-menu__high-contrast-button"
        type="button"
        role="switch"
        aria-labelledby={labelId}
        aria-checked={highContrast}
        onClick={handleHighContrastControl}
      >
        <span aria-hidden>
          {t("reader.menus.appearance.high_contrast_off")}
        </span>
        <Toggle $checked={highContrast} />
        <span aria-hidden>{t("reader.menus.appearance.high_contrast_on")}</span>
      </button>
    </Section>
  );
}
