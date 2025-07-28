import { ChapterTitle } from "@vidstack/react";
import * as Buttons from "../../shared/Buttons";
import * as Menus from "../../shared/Menus";
import * as Sliders from "../../shared/Sliders";
import { TimeGroup } from "../../shared/TimeGroup";
import * as Styled from "./styles";
// export interface VideoLayoutProps {
//   thumbnails?: string;
// }

export default function VideoLayout({ thumbnails }) {
  return (
    <>
      <Gestures />
      <Styled.Captions className={`vds-captions`} />
      <Styled.ControlsRoot className={`vds-controls`}>
        <div className="vds-controls-spacer" />
        {/* <Styled.ControlsGroup className={`vds-controls-group`}>
        </Styled.ControlsGroup> */}
        <Styled.ControlsGroup className={`vds-controls-group`}>
          <Buttons.Play tooltipPlacement="top start" />
          <Sliders.Time thumbnails={thumbnails} />
          <TimeGroup />
          <ChapterTitle className="vds-chapter-title" />
          <div className="vds-controls-spacer" />
          <Menus.Volume tooltipPlacement="top" />
          <Buttons.Caption tooltipPlacement="top" />
          <Buttons.PIP tooltipPlacement="top" />
          <Buttons.Fullscreen tooltipPlacement="top end" />
          <Menus.Settings placement="top end" tooltipPlacement="top" />
        </Styled.ControlsGroup>
      </Styled.ControlsRoot>
    </>
  );
}

function Gestures() {
  return (
    <>
      <Styled.Gesture event="pointerup" action="toggle:paused" />
      <Styled.Gesture event="dblpointerup" action="toggle:fullscreen" />
      <Styled.Gesture event="pointerup" action="toggle:controls" />
      <Styled.Gesture event="dblpointerup" action="seek:-10" />
      <Styled.Gesture event="dblpointerup" action="seek:10" />
    </>
  );
}
