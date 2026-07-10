import styled from "@emotion/styled";
import { transientOptions } from "helpers/emotionHelpers";
import {
  defaultFocusStyle,
  defaultHoverStyle,
  buttonUnstyled
} from "theme/styles/mixins";

export const Box = styled("div", transientOptions)`
  --_Title-margin-block-end: 16px;

  position: relative;
  background-color: var(--color-base-neutral10);
  border: 1px solid var(--color-base-neutral40);
  border-radius: 12px;
  padding: 40px;
  font-family: var(--font-family-sans);
  width: 100%;
  text-align: center;

  ${({ $dismissable }) =>
    $dismissable &&
    `
    --_Title-margin-block-end: 6px;

    padding-block: 32px;
    text-align: left;
  `}

  ${({ $noBorder }) =>
    $noBorder &&
    `
    --_Title-margin-block-end: 12px;
    border-color: transparent;
    background-color: var(--color-base-neutral05);
    `}
`;

export const Title = styled.h3`
  color: var(--color-base-neutral90);
  font-size: 18px;
  font-weight: var(--font-weight-medium);
  line-height: 1.22;
  margin: 0;
  margin-block-end: var(--_Title-margin-block-end);
`;

export const Body = styled.div`
  font-size: 15px;
  font-weight: var(--font-weight-regular);
  line-height: 1.27;
  color: var(--color-base-neutral75);

  > * + * {
    margin-block-start: var(--_Title-margin-block-end);
  }
`;

export const Close = styled.button`
  ${buttonUnstyled}
  position: absolute;
  top: 13.5px;
  right: 20px;

  &:hover {
    ${defaultHoverStyle}
  }

  &:focus-visible {
    ${defaultFocusStyle}
  }
`;
