import styled from "@emotion/styled";
import {
  fluidScale,
  headingQuaternary,
  subtitlePrimary,
  respond
} from "theme/styles/mixins";
import Utility from "global/components/utility";

export const Header = styled.header`
  padding-bottom: ${({ $small }) =>
    $small ? "20px" : fluidScale("53px", "21px")};
`;

export const TitleWrapper = styled.h2`
  ${headingQuaternary}
  display: flex;
  min-width: 0;
`;

export const Icon = styled(Utility.IconComposer)`
  margin-right: 10px;
  margin-left: -8px;
`;

export const Title = styled.span`
  padding-top: 2px;
  color: var(--strong-color);
`;

export const Instructions = styled.span`
  ${subtitlePrimary}
  font-size: 17px;
  display: inline-block;
  margin-block-start: 12px;

  ${({ $warning }) => $warning && `color: var(--error-color);`}
`;

export const ButtonGroup = styled.div`
  margin-top: 24px;

  ${({ $grid }) =>
    $grid &&
    `
    > *:not(:last-child) {
      margin-right: 1em;
    }
    ${respond(
      `
    display: grid;
    grid-template-columns: 1.25fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 12px;

    > *:not(:last-child) {
      margin-right: 0;
    }
    `,
      40
    )}`}
`;
