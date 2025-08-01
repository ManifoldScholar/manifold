import {
  Captions as BaseCaptions,
  Controls as BaseControls
} from "@vidstack/react";
import styled from "@emotion/styled";

export const ControlsRoot = styled(BaseControls.Root)`
  border-radius: var(--media-border-radius);

  :global(.media-player[data-focus]:not([data-playing])) & {
    box-shadow: var(--media-focus-ring);
  }

  :global(.vds-time-slider) {
    --media-slider-height: 36px;
    --media-slider-preview-offset: 8px;
  }

  :global(.vds-volume-slider) {
    --media-slider-width: 72px;
    --media-slider-height: 40px;
    --media-slider-preview-offset: 40px;
    margin-left: 1.5px;
    margin-right: 8px;
  }

  :global(.vds-time-group) {
    margin-left: 8px;
  }
`;

export const ControlsGroup = styled(BaseControls.Group)`
  display: flex;
  align-items: center;
  width: 100%;

  &:nth-child(2) {
    padding-inline: 8px;
    padding-bottom: 8px;
  }
}
`;

export const Captions = styled(BaseCaptions)`
  display: inline-block;
  position: absolute;
  width: 100%;
  top: unset;
  bottom: calc(100% + 2px);
  text-align: center;
  background-color: transparent;

  [data-part="cue"] {
    color: white;
    border: rgb(255 255 255 / 0.1);
    background-color: black;
    padding: 0.25rem;
  }

  /* Hide captions when interacting with time slider. */
  :global(.media-player[data-preview]) & {
    opacity: 0;
  }
`;
