import styled from "@emotion/styled";

export const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  inline-size: 100%;
  block-size: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  video::cue {
    font-size: 16px;
    background: rgba(0, 0, 0, 0.75);
    color: var(--color-base-neutral-white);
    font-family: var(--font-family-heading);
  }
`;

export const Iframe = styled.iframe`
  inline-size: var(--VideoResource-inline-size);
  block-size: 100%;
  aspect-ratio: 16 / 9;
  background-color: var(--color-base-neutral-black);
`;

export const Video = styled.video`
  inline-size: 100%;
  block-size: 100%;
  object-fit: contain;
  background-color: var(--color-base-neutral-black);
`;
