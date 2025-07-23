import styled from "@emotion/styled";
import { MediaPlayer as BaseMediaPlayer } from "@vidstack/react";

// See https://vidstack.io/docs/player/components/layouts/default-layout/?styling=default-theme#css-variables for all variables
export const MediaPlayer = styled(BaseMediaPlayer)`
  --color: var(--color-base-neutral-white);
  --hover-color: var(--color-interaction-light);
`;
