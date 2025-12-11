import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { respond } from "theme/styles/mixins";

function getPositionStyles(position) {
  switch (position) {
    case "right":
      return `
        padding-top: 30px;

        ${respond(
          `
            order: 2;
            padding-top: 0;
          `,
          65
        )}
      `;
    case "left":
      return `
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        gap: 30px;
        margin-bottom: 0;
      `;
    default:
      return ``;
  }
}

export const Column = styled("div", transientOptions)`
  ${({ $position }) => getPositionStyles($position)}
  ${({ $footerType }) =>
    $footerType === "branded" &&
    `
      display: none;
      ${respond(`display: block;`, 65)}
    `}
`;
