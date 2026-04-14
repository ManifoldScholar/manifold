import React from "react";
import { useTranslation } from "react-i18next";
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
  cssVisible,
  controlsRef
}) {
  const { t } = useTranslation();
  const menu = useMenuBarState({
    orientation: "horizontal",
    loop: true,
    wrap: "horizontal"
  });
  return (
    <ReakitMenuBar
      as={Styled.Toolbar}
      aria-label={t("editor.controls.labels.toolbar_html")}
      {...menu}
    >
      <ReakitMenuItem
        ref={controlsRef}
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
        label={
          cssVisible
            ? t("editor.controls.labels.hide_styles")
            : t("editor.controls.labels.show_styles")
        }
        icon={cssVisible ? "eyeClosed32" : "eyeOpen32"}
        onClick={toggleStyles}
        {...menu}
      />
    </ReakitMenuBar>
  );
}
