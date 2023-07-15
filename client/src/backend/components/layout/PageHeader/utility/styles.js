import styled from "@emotion/styled";
import { Row } from "../patterns/styles";
import { respond, fluidScale } from "theme/styles/mixins";

export const DropdownRow = styled(Row)`
  ${respond(`display: none;`, 65)};

  ${Row} + & {
    padding-block-start: 0;
  }
`;

export const UtilityRow = styled.div`
  background-color: var(--color-base-neutral100);
  padding: 10px ${fluidScale("28px", "16px")};
  border-bottom-left-radius: var(--box-border-radius);
  border-bottom-right-radius: var(--box-border-radius);
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ $hideOnMobile }) =>
    $hideOnMobile &&
    `
    display: none;
    ${respond(`display: flex;`, 65)}
  `}
`;

export const Note = styled.span`
  font-family: var(--font-family-serif);
  font-size: ${fluidScale("17px", "14px")};
  line-height: initial;
  padding-block: 3px;
`;
