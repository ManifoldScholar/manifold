import styled from "@emotion/styled";
import { Link as LinkComponent } from "react-router-dom";
import { defaultTransitionProps } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

const nestedLevelPadding = "1.611em";

export const Link = styled(LinkComponent, transientOptions)`
  display: block;
  padding-top: 0.444em;
  padding-bottom: 0.5em;
  padding-left: var(--link-indent, ${nestedLevelPadding});
  color: inherit;
  text-decoration: none;
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:hover,
  &.focus-visible {
    --Node-Title-color: inherit;

    background-color: var(--color-accent-primary-off-white);
  }
`;

export const TextTitle = styled.span`
  margin-left: 6px;
  color: var(--Node-Title-color, var(--color));
  transition: color ${defaultTransitionProps};
`;
