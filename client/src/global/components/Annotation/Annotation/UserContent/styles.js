import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import {
  drawerIndent,
  listHorizontal,
  buttonUnstyled,
  utilityPrimary,
  defaultHoverStyle
} from "theme/styles/mixins";

export const Inner = styled.div`
  padding-block-start: var(--Annotation-Detail-Inner-padding-block-start);
  border-block-start: var(--Annotation-Detail-Inner-border);
`;

export const Body = styled.section`
  ${drawerIndent("padding-inline-start")}
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-regular);
  line-height: 1.375;
  color: var(--strong-color);
`;

export const Utility = styled.div`
  ${drawerIndent("--Editor-padding-inline-start")}
  margin-top: 10px;
`;

export const UtilityList = styled("ul", transientOptions)`
  ${listHorizontal}
  ${drawerIndent("padding-left")}
  display: flex;
  flex-wrap: wrap;
  color: var(--medium-color);

  ${({ $isFlagged }) =>
    $isFlagged && `--secondary-button-color: var(--error-color);`}

  > li:not(:last-child) {
    margin-right: 26px;
  }
`;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  font-size: 12px;

  &[aria-expanded="true"] {
    ${defaultHoverStyle}
    margin-bottom: 15px;
  }
`;

export const SecondaryButton = styled(Button)`
  color: var(--secondary-button-color);
`;

export const Thread = styled.div`
  &:focus {
    outline: none;
  }
`;
