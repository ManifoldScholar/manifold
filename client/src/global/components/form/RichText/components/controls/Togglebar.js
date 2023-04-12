import React from "react";
import Toggle from "./Toggle";
import * as Styled from "./styles";

export default function ToggleBar({ htmlMode, onClickEditorToggle }) {
  return (
    <Styled.ToggleBar>
      <Toggle
        options={[
          {
            label: "HTML Editor",
            icon: "editorHTML24",
            active: htmlMode,
            onClick: onClickEditorToggle
          },
          {
            label: "Rich Text Editor",
            icon: "editorRTE24",
            active: !htmlMode,
            onClick: onClickEditorToggle
          }
        ]}
      />
      <Toggle
        options={[
          {
            label: "Dark",
            icon: "darkMode16",
            iconSize: 12,
            active: true,
            onClick: e => e.preventDefault()
          },
          {
            label: "Light",
            icon: "lightMode16",
            iconSize: 12,
            active: false,
            onClick: e => e.preventDefault()
          }
        ]}
        padding="16px"
      />
    </Styled.ToggleBar>
  );
}
