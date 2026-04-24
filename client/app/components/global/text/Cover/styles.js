import styled from "styled-components";
import { respond, defaultTransitionProps } from "theme/styles/mixins";

export const Cover = styled("figure")`
  position: relative;
  display: none;
  padding-top: 0;
  margin-bottom: 0;
  line-height: 1;

  ${respond(`display: block;`, 60)}

  ${({ $hasCover }) =>
    $hasCover
      ? `
        min-width: 56px;
        max-width: 56px;
        height: auto;
        margin-right: 17px;`
      : `
        margin-right: 5px;
        margin-left: -10px;
        color: var(--content-color, var(--color-neutral-ui-dull-dark));
        transition: color ${defaultTransitionProps};`}
`;

export const Image = styled.img`
  width: 56px;
  height: auto;
  border: 1px solid transparent;
  transition: border ${defaultTransitionProps};
`;
