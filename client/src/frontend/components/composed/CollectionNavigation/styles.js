import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { respond } from "theme/styles/mixins";

export const List = styled("ul", transientOptions)`
  --gap: 20px;

  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  margin: 0;

  ${({ $count }) => respond(`justify-content: center;`, $count > 3 ? 120 : 75)}

  > * {
    flex-basis: 100%;

    ${({ $count }) => `
      ${
        $count > 3 ? respond(`flex-basis: calc(50% - var(--gap) / 2);`, 60) : ``
      }
      ${respond(`flex-basis: auto;`, $count > 3 ? 120 : 75)}
    `}
  }
`;
