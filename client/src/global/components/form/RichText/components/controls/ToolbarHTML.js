import React from "react";
import { FunctionButton } from "./buttons";
import {
  MenuBar as ReakitMenuBar,
  MenuItem as ReakitMenuItem,
  useMenuBarState
} from "reakit/Menu";
import * as Styled from "./styles";

export default function ToolbarHTML({
  onClickUndo,
  onClickRedo,
  toggleStyles,
  cssVisible
}) {
  const menu = useMenuBarState({
    orientation: "horizontal",
    loop: true,
    wrap: "horizontal"
  });
  return (
    <ReakitMenuBar as={Styled.Toolbar} aria-label="Rich text toolbar" {...menu}>
      <ReakitMenuItem
        as={FunctionButton}
        icon="undo24"
        onClick={onClickUndo}
        isFirst
        {...menu}
      />
      <ReakitMenuItem
        as={FunctionButton}
        icon="redo24"
        onClick={onClickRedo}
        {...menu}
      />
      <ReakitMenuItem
        as={FunctionButton}
        label={cssVisible ? "Hide Styles" : "Show Styles"}
        icon={cssVisible ? "eyeClosed32" : "eyeOpen32"}
        onClick={toggleStyles}
        {...menu}
      />
    </ReakitMenuBar>
  );
}
