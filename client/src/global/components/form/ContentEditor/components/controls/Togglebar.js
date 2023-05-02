import React from "react";
import Toggle from "./Toggle";
import * as Styled from "./styles";

export default function ToggleBar({
  htmlMode,
  onClickEditorToggle,
  darkMode,
  onClickDarkModeToggle
}) {
  return (
    <Styled.ToggleBar>
      <Toggle
        options={[
          {
            label: "HTML Editor",
            icon: "editorHTML24",
            active: htmlMode,
            onClick: onClickEditorToggle(true)
          },
          {
            label: "Rich Text Editor",
            icon: "editorRTE24",
            active: !htmlMode,
            onClick: onClickEditorToggle(false)
          }
        ]}
      />
      <Toggle
        options={[
          {
            label: "Dark",
            icon: "darkMode16",
            iconSize: 12,
            active: darkMode,
            onClick: onClickDarkModeToggle(true)
          },
          {
            label: "Light",
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
