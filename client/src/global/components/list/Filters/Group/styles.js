import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import { utilityPrimary, buttonUnstyled } from "theme/styles/mixins";
import { entityFilterForm } from "theme/styles/variables/crossComponent";

const { gap, selectMinWidth } = entityFilterForm;

export const Wrapper = styled("div", transientOptions)`
  ${({ $count, $searchCount, $containerWrapPoint }) => `
    flex-basis:
      ${entityFilterForm.flexBasis($count, $searchCount)};
    flex-grow: 1;
    align-self: center;
    position: relative;
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: ${gap}px;
    margin: 0;

    &:has(:where(select)) {
      /* adjust for filter label height so filters align with other elements */
      transform: translateY(-13px);
    }

    ${($count || $searchCount) &&
      `
      @container (max-inline-size: ${$containerWrapPoint ||
        entityFilterForm.flexBasis($count, $searchCount)}) {
        transform: translateY(0);
      }
    `}
  `};
`;

export const SelectGroup = styled("div", transientOptions)`
  --min-width: var(--SelectGroup-min-width, ${selectMinWidth}px);

  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--min-width), 1fr));
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

  &:focus-visible {
    color: var(--focus-color);
  }
`;
