import styled from "@emotion/styled";
import {
  panelRounded,
  respond,
  utilityPrimary,
  subtitlePrimary
} from "theme/styles/mixins";

const basePaddingVertical = "24px";
const basePaddingLateral = "30px";
const gap = "12px";

export const ActionBox = styled.div`
  ${panelRounded}
  padding: ${basePaddingVertical} ${basePaddingLateral};
  font-size: 14px;
  color: var(--strong-color);

  ${respond(
    `
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      padding-top: calc(${basePaddingVertical} - ${gap});
      padding-left: calc(${basePaddingLateral} - ${gap});

      > * {
        margin-top: ${gap};
        margin-left: ${gap};
      }
    `,
    65
  )}
`;

export const Heading = styled.div`
  flex-basis: 50%;
  flex-grow: 1;
`;

export const Title = styled.span`
  ${utilityPrimary}
  display: block;
  padding-bottom: 5px;
  font-size: inherit;

  ${respond(
    `display: inline-block;
    padding-right: 12px;`,
    65
  )}
`;

export const Instructions = styled.span`
  ${subtitlePrimary}
  display: inline-block;
  padding-bottom: 25px;
  font-size: 18px;

  ${respond(`padding-bottom: 0;`, 65)}
`;
