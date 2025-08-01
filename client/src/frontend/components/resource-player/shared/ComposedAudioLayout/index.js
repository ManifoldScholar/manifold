import { ChapterTitle } from "@vidstack/react";

import * as Buttons from "../Buttons";
import * as Menus from "../Menus";
import * as Sliders from "../Sliders";
import { TimeGroup } from "../TimeGroup";
import * as Styled from "./styles";

export default function AudioLayout() {
  return (
    <>
      <Styled.Captions className={`vds-captions`} />
      <Styled.ControlsRoot className={`vds-controls`}>
        <Styled.ControlsGroup className={`vds-controls-group`}>
          <Buttons.Seek seconds={-10} tooltipPlacement="top start" />
          <Buttons.Play tooltipPlacement="top" />
          <Buttons.Seek seconds={10} tooltipPlacement="top" />
          <Sliders.Time />
          <TimeGroup />
          <ChapterTitle className="vds-chapter-title" />
          <Menus.Volume tooltipPlacement="top" />
          <Buttons.Caption tooltipPlacement="top" />
          <Menus.Settings placement="top end" tooltipPlacement="top end" />
        </Styled.ControlsGroup>
      </Styled.ControlsRoot>
    </>
  );
}
