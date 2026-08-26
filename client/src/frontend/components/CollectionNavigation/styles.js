import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { respond } from "theme/styles/mixins";

export const List = styled("ul", transientOptions)`
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

  ${({ $isJournals }) =>
    $isJournals &&
    `
    ${respond(`margin-inline: auto;`, 120)}
    ${respond(`max-inline-size: 40rem;`, 120)}
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

    ${({ $isJournals }) =>
      $isJournals &&
      `
      ${respond(`flex-grow: 0;`, 120)}
    `}
  }
`;
