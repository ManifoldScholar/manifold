import styled from "@emotion/styled";
import { MediaPlayer as BaseMediaPlayer } from "@vidstack/react";

export const MediaPlayer = styled(BaseMediaPlayer)`
  --color: var(--color-base-neutral-white);
  --hover-color: var(--media-brand);
  --focus-color: var(--media-brand);

  --media-brand: var(--color-interaction-light);
  --media-focus-ring-color: var(--focus-color);
  --media-focus-ring: 0 0 0 3px var(--media-focus-ring-color);
  --media-background-color: var(--color-base-neutral-black);

  --default-bg: var(--media-background-color);
  --default-color: var(--color-base-neutral-white);
  --media-font-family: var(--font-family-sans);
  --media-controls-background: rgba(0, 0, 0, 0.7);

  /* menus */
  --media-menu-padding: 0.25rem;

  /* time */
  --media-time-font-size: 0.6875rem;
  --media-time-font-weight: var(--font-weight-semibold);
  --media-time-padding: 0px 0.125rem 0.125rem 0.125rem;

  /* tooltips */
  --media-tooltip-bg-color: var(--media-background-color);
  --media-tooltip-color: var(--color);
  --media-tooltip-font-size: 0.6875rem;
  --media-tooltip-font-weight: var(--font-weight-semibold);

  /* captions */
  --media-user-font-family: var(--font-family-sans);

  width: 100%;
  background-color: var(--media-background-color, #212121);

  &[data-view-type="audio"] {
    --media-tooltip-y-offset: 0.5rem;
    --media-menu-y-offset: 0.5rem;
    --media-slider-chapter-title-color: black;
    --media-border-radius: 0.25rem;
    background-color: var(--media-background-color, #212121);
    border-radius: var(--media-border-radius);
    contain: layout;
  }

  &[data-view-type="video"] {
    --media-tooltip-y-offset: 0.5rem;
    --media-menu-y-offset: 0.5rem;
    --media-border-radius: 0.25rem;
    aspect-ratio: 16 /9;
    background-color: var(--media-background-color, #212121);
    border-radius: var(--media-border-radius);
    contain: layout;
  }

  & video,
  .poster {
    border-radius: var(--media-border-radius);
  }

  .srcButtons {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin-top: 40px;
    margin-inline: auto;
    max-width: 300px;
  }
`;
