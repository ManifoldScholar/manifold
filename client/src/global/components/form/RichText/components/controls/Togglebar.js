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
            active: htmlMode,
            onClick: onClickEditorToggle
          },
          {
            label: "Rich Text Editor",
            active: !htmlMode,
            onClick: onClickEditorToggle
          }
        ]}
      />
      <Toggle
        options={[
          { label: "Dark", active: true },
          { label: "Light", active: false }
        ]}
      />
    </Styled.ToggleBar>
  );
}
