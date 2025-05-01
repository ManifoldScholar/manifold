import styled from "@emotion/styled";
import {
  utilityPrimary,
  defaultTransitionProps,
  buttonUnstyled,
  defaultFocusStyle,
} from "theme/styles/mixins";

export const Total = styled.p`
  ${utilityPrimary}
  font-size: 13px;
  color: var(--color);
  transition: color ${defaultTransitionProps};
  display: flex;
  gap: 12px;

  .section-heading-secondary & {
    float: right;
  }

  .section-heading-secondary a:hover & {
    color: var(--hover-color);
  }

  strong,
  b {
    font-weight: inherit;
    color: var(--strong-color);
  }
`;

export const Highlighted = styled.span`
  color: var(--strong-color);
`;

export const Select = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  font-size: 13px;
  color: var(--highlight-color);

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;

export const All = styled.div`
  padding-inline: 24px;
  padding-block: 8px;
  background: var(--color-base-neutral80);
  color: var(--color-neutral-text-extra-dark);
  margin-top: 8px;
  margin-block-end: -16px;

  > span {
    ${utilityPrimary}
    font-size: 13px;
    color: var(--strong-color);
    margin-inline-end: 12px;
    display: inline-block;

    &::before {
      content: "";
      display: inline-block;
      height: 8px;
      width: 16px;
      border-bottom-left-radius: 4px;
      border-left: 1px solid var(--strong-color);
      border-bottom: 1px solid var(--strong-color);
      color: var(--color-neutral-ui-light);
      margin-inline-end: 12px;
    }
  }
`;
