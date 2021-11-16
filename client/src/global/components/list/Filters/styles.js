import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { entityFilterForm } from "theme/styles/variables/crossComponent";

const { gap, selectMinWidth } = entityFilterForm;

export const Wrapper = styled("div", transientOptions)`
  flex-basis: ${({ $count }) => entityFilterForm.flexBasis($count, 1)};
  align-self: center;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: ${gap}px;

  > * {
    flex-grow: 1;
  }

  .resource-totals + & {
    padding-top: 40px;
  }
`;

export const SelectGroup = styled("div", transientOptions)`
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${selectMinWidth}px, 1fr));
  grid-gap: ${gap}px;
  margin-bottom: 0;
  flex-basis: ${({ $count }) => entityFilterForm.flexBasis($count)};
`;

export const ResetButton = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  font-size: 13px;

  &:focus-visible {
    color: var(--focus-color);
  }
`;
