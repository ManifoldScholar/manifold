import styled from "@emotion/styled";
import { MediaPlayer as BaseMediaPlayer } from "@vidstack/react";

// See https://vidstack.io/docs/player/components/layouts/default-layout/?styling=default-theme#css-variables for all variables
export const MediaPlayer = styled(BaseMediaPlayer)`
  --color: var(--color-base-neutral-10);
  --hover-color: var(--color-interaction-light);

  --video-bg: var(--color-base-neutral-black);
  --video-font-family: var(--font-family-sans);

  --audio-bg: var(--color-base-neutral-black);
  --audio-font-family: var(--font-family-sans);
`;
