import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import {
  listUnstyled,
  respond,
  utilityPrimary,
  fluidScale
} from "theme/styles/mixins";

export const PrimaryList = styled("ul", transientOptions)`
  ${listUnstyled}

  ${({ $columnar }) =>
    $columnar &&
    `
    column-width: 350px;
    column-gap: min(10.2vw, 30px);
  `}

  & + & {
    ${respond(`margin-top: 30px;`, 60)}
  }
`;

export const SecondaryList = styled("ul", transientOptions)`
  ${listUnstyled}

  ${({ $columnar }) =>
    $columnar &&
    respond(
      `
        max-width: 810px;
        column-count: 2;
      `,
      60
    )}
`;

export const ListItem = styled.li`
  ${PrimaryList} & {
    display: inline-block;
    width: 100%;
    break-inside: avoid;
  }

  ${SecondaryList} & {
    ${utilityPrimary}
      display: block;
      width: 100%;
      font-size: 13px;

      & + li {
        margin-top: 10px;
      }
    }
  }
`;

export const Label = styled.span`
  ${PrimaryList} & {
    ${utilityPrimary}
    display: block;
    font-size: 12px;

    ${respond(`font-size: 14px;`, 60)}
  }

  ${SecondaryList} & {
    &::after {
      display: inline;
      content: ": ";
    }
  }
`;

export const Value = styled.div`
  ${PrimaryList} & {
    margin-top: 0.5em;
    margin-bottom: 1.667em;
    font-size: ${fluidScale("20px", "18px")};
    font-family: var(--font-family-sans);
    color: var(--strong-color);
  }
  ${SecondaryList} & {
    margin-top: 3px;
    color: var(--strong-color);

    a {
      text-decoration-line: underline;
    }
  }
`;
