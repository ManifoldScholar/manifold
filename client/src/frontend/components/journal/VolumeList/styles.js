import styled from "@emotion/styled";
import { fluidScale, respond } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 60px;
  padding-block-end: ${fluidScale("40px", "20px")};

  ${respond(
    `
      --Box-border-radius: 0;
      margin-inline: calc(-1 * var(--container-padding-inline-fluid));
    `,
    60,
    "max"
  )}
`;
