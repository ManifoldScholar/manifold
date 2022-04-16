import styled from "@emotion/styled";
import { respond, containerPrototype } from "theme/styles/mixins";

export const Container = styled.section`
  ${respond(containerPrototype, 60)}

  .overlay-full & {
    margin-block-end: 17px;

    ${respond(`margin-block-end: 40px;`, 60)}
  }
`;

export const Hero = styled.div`
  position: relative;
`;

export const Resource = styled.div`
  --focus-color: var(--color-interaction-light);
  --hover-color: var(--color-interaction-light);

  position: relative;
  display: flex;
  width: 100%;
  height: 52vw;
  min-height: 350px;
  max-height: 52vh;
  overflow: hidden;
  color: var(--color-neutral-text-extra-light);
  background-color: var(--color-base-neutral-black);
  margin-block-end: 32px;

  ${respond(`margin-block-end: 40px;`, 50)}

  .overlay-full & {
    margin-block-end: 19px;
  }
`;

export const ResourceAudio = styled(Resource)`
  height: auto;
`;
