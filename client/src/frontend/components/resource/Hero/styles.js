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

  .resource-slide-figure {
    margin-block-end: 32px;

    ${respond(`margin-block-end: 40px;`, 50)}

    .overlay-full & {
      margin-block-end: 19px;
    }
  }
`;
