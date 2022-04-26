import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { entityFilterForm } from "theme/styles/variables/crossComponent";

const { gap, selectMinWidth } = entityFilterForm;

export const Wrapper = styled("div", transientOptions)`
  flex-basis: ${({ $count, $searchCount }) =>
    entityFilterForm.flexBasis($count, $searchCount)};
  flex-grow: 1;
  align-self: center;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  gap: ${gap}px;
  margin: 0;
`;

export const SelectGroup = styled("div", transientOptions)`
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${selectMinWidth}px, 1fr));
  grid-gap: ${gap}px;
  margin-bottom: 0;
  flex-basis: ${({ $count }) => entityFilterForm.flexBasis($count)};
  flex-grow: 1;
`;

export const ResetButton = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  font-size: 13px;

  &.focus-visible {
    color: var(--focus-color);
  }
`;
