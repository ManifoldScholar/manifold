import styled from "@emotion/styled";
import { Link as LinkComponent } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import { transientOptions } from "helpers/emotionHelpers";
import { respond, defaultTransitionProps } from "theme/styles/mixins";

export const Wrapper = styled("div", transientOptions)`
  --EntityListTotal-margin-block-end: 25px;

  padding-block: 5px;
  margin-block-start: 40px;
  text-align: center;

  ${respond(`--EntityListTotal-margin-block-end: 50px`, 60)}

  ${({ $alignLeft }) =>
    $alignLeft && `text-align: start;`}

  &:not(:last-child) {
    margin-block-end: var(--EntityListTotal-margin-block-end);
  }
`;

export const Link = styled(LinkComponent)`
  font-family: var(--font-family-heading);
  font-size: 20px;
  text-decoration: none;

  &:hover {
    --Value-color: var(--hover-color);
    --Value-transition: color ${defaultTransitionProps};
  }
`;

export const Value = styled.span`
  color: var(--Value-color, var(--strong-color));
  transition: var(--Value-transition, none);
`;

export const Icon = styled(IconComposer)`
  margin-bottom: 2px;
  margin-left: 15px;
`;
