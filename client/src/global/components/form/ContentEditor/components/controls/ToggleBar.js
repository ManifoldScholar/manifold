import React from "react";
import { useTranslation } from "react-i18next";
import Toggle from "./Toggle";
import * as Styled from "./styles";

export default function ToggleBar({
  htmlMode,
  onClickEditorToggle,
  darkMode,
  onClickDarkModeToggle
}) {
  const { t } = useTranslation();

  return (
    <Styled.ToggleBar>
      <Toggle
        options={[
          {
            label: t("editor.controls.toggles.html_label"),
            mobileLabel: t("editor.controls.toggles.html_label_mobile"),
            icon: "editorHTML24",
            active: htmlMode,
            onClick: onClickEditorToggle(true)
          },
          {
            label: t("editor.controls.toggles.rte_label"),
            mobileLabel: t("editor.controls.toggles.rte_label_mobile"),
            icon: "editorRTE24",
            active: !htmlMode,
            onClick: onClickEditorToggle(false)
          }
        ]}
      />
      <Toggle
        options={[
          {
            label: t("editor.controls.toggles.dark_mode_label"),
            icon: "darkMode16",
            iconSize: 12,
            active: darkMode,
            onClick: onClickDarkModeToggle(true)
          },
          {
            label: t("editor.controls.toggles.light_mode_label"),
            icon: "lightMode16",
            iconSize: 12,
            active: !darkMode,
            onClick: onClickDarkModeToggle(false)
          }
        ]}
        padding="16px"
      />
    </Styled.ToggleBar>
  );
}
