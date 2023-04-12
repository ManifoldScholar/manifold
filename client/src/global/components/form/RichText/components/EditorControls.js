import React from "react";
import { Toolbar, ToggleBar } from "./controls";
import * as Styled from "./styles";

export default function EditorControls({
  htmlMode,
  onClickEditorToggle,
  selection
}) {
  return (
    <Styled.Controls>
      <ToggleBar
        htmlMode={htmlMode}
        onClickEditorToggle={onClickEditorToggle}
      />
      <Toolbar selection={selection} />
    </Styled.Controls>
  );
}
