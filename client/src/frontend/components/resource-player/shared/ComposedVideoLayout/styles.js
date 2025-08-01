import {
  Captions as BaseCaptions,
  Controls as BaseControls,
  Gesture as BaseGesture
} from "@vidstack/react";
import styled from "@emotion/styled";

export const ControlsRoot = styled(BaseControls.Root)`
  :global(.vds-time-slider) {
    --media-slider-height: 40px;
  }

  :global(.vds-time-slider .vds-slider-value) {
    background-color: unset;
  }

  :global(.vds-volume-slider) {
    --media-slider-height: 40px;
    --media-slider-preview-offset: 32px;
    margin-left: 1.5px;
    max-width: 80px;
  }

  :global(.vds-time-group) {
    margin-left: 8px;
  }
`;

export const ControlsGroup = styled(BaseControls.Group)`
  display: flex;
  align-items: center;
  width: 100%;
  padding-inline: 8px;
  padding-block-start: 4px;

  &:last-child {
    margin-top: -4px;
    padding-bottom: 8px;
  }
`;

export const Gesture = styled(BaseGesture)`
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;

  &[action="seek:-10"],
  &[action="seek:10"] {
    width: 20%;
    z-index: 1;
  }

  &[action="seek:10"] {
    left: unset;
    right: 0;
  }

  /* Remove toggle to pause on touch. */
  @media (pointer: coarse) {
    &[action="toggle:paused"] {
      display: none;
    }
  }

  /* Remove toggle controls on mouse. */
  @media not (pointer: coarse) {
    &[action="toggle:controls"] {
      display: none;
    }
  }
`;

export const Captions = styled(BaseCaptions)`
  z-index: 10;
  bottom: 0;
  transition: bottom 0.15s linear;

  /* Pull captions up when controls are visible. */
  .media-player[data-controls] & {
    bottom: 80px;
  }

  /* Hide captions when interacting with time slider. */
  :global(.media-player[data-preview]) & {
    opacity: 0;
  }
`;
