import styled from "@emotion/styled";
import { MediaPlayer as BaseMediaPlayer } from "@vidstack/react";

// See https://vidstack.io/docs/player/components/layouts/default-layout/?styling=default-theme#css-variables for all variables
export const MediaPlayer = styled(BaseMediaPlayer)`
  --color: var(--color-base-neutral-white);
  --hover-color: var(--color-interaction-light);

  --video-bg: var(--color-base-neutral95);
  --video-font-family: var(--font-family-sans);

  --audio-bg: var(--color-base-neutral95);
  --audio-font-family: var(--font-family-sans);

  --media-chapter-title-color: var(--color);
  --media-menu-checkbox-handle-bg: var(--color);
  --media-menu-checkbox-bg-active: var(--highlight-color);
  --media-slider-track-bg: hsl(0deg 0% 100% / 50%);
`;
