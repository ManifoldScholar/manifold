import styled from "@emotion/styled";

export const VideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  video::cue {
    font-size: 16px;
    background: rgba(0, 0, 0, 0.75);
    color: var(--color-base-neutral-white);
    font-family: var(--font-family-heading);
  }
`;

export const Iframe = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-base-neutral-black);
`;

export const Video = styled.video`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--color-base-neutral-black);
`;
