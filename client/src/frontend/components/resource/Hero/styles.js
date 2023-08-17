import styled from "@emotion/styled";
import { respond, fluidScale } from "theme/styles/mixins";

export const Hero = styled.div`
  position: relative;

  .overlay-full & {
    margin-block-end: 17px;

    ${respond(`margin-block-end: 40px;`, 60)}
  }
`;

export const Resource = styled.div`
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);

  position: relative;
  display: flex;
  width: 100%;
  min-height: ${({ $minHeight }) =>
    $minHeight ? `max(${$minHeight}, 350px)` : `350px`};
  max-height: 52vh;
  overflow: hidden;
  overflow-x: auto;
  color: var(--color-neutral-text-extra-light);
  background-color: var(--color-base-neutral-black);
  margin-block-end: ${fluidScale("42px", "30px")};

  .overlay-full & {
    margin-block-end: 19px;
  }
`;

export const ResourceAudio = styled(Resource)`
  height: auto;
`;
