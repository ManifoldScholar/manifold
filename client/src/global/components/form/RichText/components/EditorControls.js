import React from "react";
import { ToolbarRTE, ToolbarHTML, ToggleBar } from "./controls";
import * as Styled from "./styles";

export default function EditorControls({
  htmlMode,
  cssVisible,
  darkMode,
  onClickEditorToggle,
  onClickDarkModeToggle,
  selection,
  onClickRedo,
  onClickUndo,
  toggleStyles
}) {
  return (
    <Styled.Controls>
      <ToggleBar
        htmlMode={htmlMode}
        darkMode={darkMode}
        onClickEditorToggle={onClickEditorToggle}
        onClickDarkModeToggle={onClickDarkModeToggle}
      />
      {htmlMode ? (
        <ToolbarHTML
          onClickUndo={onClickUndo}
          onClickRedo={onClickRedo}
          toggleStyles={toggleStyles}
          cssVisible={cssVisible}
        />
      ) : (
        <ToolbarRTE
          selection={selection}
          onClickUndo={onClickUndo}
          onClickRedo={onClickRedo}
        />
      )}
    </Styled.Controls>
  );
}
