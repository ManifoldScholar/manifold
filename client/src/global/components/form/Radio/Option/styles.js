import styled from "@emotion/styled";
import {
  formLabelPrimary,
  respond,
  defaultTransitionProps,
  defaultFocusStyle
} from "theme/styles/mixins";

export const Instructions = styled.span`
  display: block;
  padding-left: 33px;
  margin-top: 6px;
  font-size: 16px;
  font-family: var(--font-family-copy);
  font-style: italic;
  text-transform: none;
`;

export const WrapperLabel = styled.label`
  ${formLabelPrimary}
  position: relative;
  display: block;
  padding-left: 33px;
  margin-bottom: 0;
  font-size: 13px;
  line-height: 1.25em;

  ${respond(`font-size: 16px;`, 60)}

  not:(.search-query__filter-list-group) > & + & {
    margin-top: 18px;
  }

  ${Instructions} + & {
    margin-top: 16px;
  }

  ${({ $inline }) =>
    $inline &&
    `
    display: block;
    font-size: 16px;

    ${respond(
      `
        display: inline-block;

        & + & {
          margin-top: 0;
          margin-left: 35px;
        }`,
      50
    )}
  `}
`;

export const RadioInput = styled.input`
  position: absolute;
  inset-inline-start: 0;
  inset-block-start: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;
  opacity: 0;
  z-index: 1;
  cursor: pointer;
`;

export const RadioToggle = styled.span`
  position: absolute;
  left: 0;
  display: block;
  user-select: none;
  background-color: var(--color-base-neutral30);
  transition: background-color ${defaultTransitionProps};
  width: 1.25em;
  height: 1.25em;
  padding-top: 0.25em;
  text-align: center;
  border-radius: 100%;

  .bg-neutral90 & {
    background-color: var(--color-neutral-ui-dark);
  }

  .search-menu & {
    border: 1px solid var(--color);
  }

  ${RadioInput}:focus ~ &,
  ${RadioInput}:focus-visible ~ &,
  ${RadioInput}:checked ~ & {
    background-color: var(--color-accent-primary-light);
  }

  &::before {
    display: inline-block;
    width: 0.625em;
    height: 0.625em;
    vertical-align: top;
    content: "";
    background-color: var(--color-base-neutral90);
    border-radius: 100%;
    opacity: 0;
    transition: opacity ${defaultTransitionProps};
  }

  ${RadioInput}:checked ~ &::before {
    opacity: 1;
  }

`;

export const ToggleLabel = styled.span`
  font-size: 14px;

  ${RadioInput}:focus-visible ~ & {
    ${defaultFocusStyle}
    outline-offset: 2px;
  }

  ${RadioInput}:checked ~ & {
    color: var(--hover-color);
  }
`;
