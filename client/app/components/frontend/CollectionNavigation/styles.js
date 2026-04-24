import styled from "styled-components";
import { respond } from "theme/styles/mixins";

export const List = styled("ul")`
  --gap: 18px;
  --Button-min-inline-size: 100%;

  display: flex;
  flex-wrap: wrap;
  gap: var(--gap);
  margin: 0;

  ${({ $count }) => `
    ${respond(`justify-content: center;`, $count > 3 ? 120 : 75)}
    ${$count >= 5 ? `${respond(`margin-inline: -26px;`, 120)}` : ``}
  `}

  > * {
    flex-basis: 100%;

    ${({ $count }) => `
      ${
        $count > 3 ? respond(`flex-basis: calc(50% - var(--gap) / 2);`, 60) : ``
      }
      ${respond(
        $count >= 5
          ? `
          flex-basis: auto;
          flex-grow: 1;
        `
          : `flex-basis: auto`,
        $count > 3 ? 120 : 75
      )}
    `}
  }
`;
