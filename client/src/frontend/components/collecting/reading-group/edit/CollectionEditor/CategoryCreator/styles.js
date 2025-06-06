import styled from "@emotion/styled";
import {
  utilityPrimary,
  buttonUnstyled,
  defaultTransitionProps
} from "theme/styles/mixins";

const collectableMinHeight = `2.4rem`;
const inputHeight = collectableMinHeight;

export const CategoryCreator = styled.form`
  --label-color: var(--color-base-neutral80);
  --label-margin-bottom: 20px;

  align-self: end;
`;

export const Label = styled.label`
  ${utilityPrimary}
  display: block;
  margin-block-end: var(--label-margin-bottom, 20px);
  font-size: 14px;
  color: var(--label-color);
  letter-spacing: 0.089em;
`;

export const InputWrapper = styled.div`
  display: flex;
`;

export const Input = styled.input`
  flex-grow: 1;
  height: ${inputHeight};
  padding: 0 20px 2px;
  font: inherit;
  background-color: var(--box-bg-color);
  border: none;
  border-top-left-radius: var(--box-border-radius);
  border-bottom-left-radius: var(--box-border-radius);
  appearance: none;

  &::placeholder {
    font-weight: var(--font-weight-regular);
    color: var(--label-color);
  }
`;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  display: flex;
  align-items: center;
  gap: min(1vw, 16px);
  height: ${inputHeight};
  padding-inline-start: 20px;
  padding-inline-end: 16px;
  font-size: 14px;
  letter-spacing: 0.089em;
  background-color: var(--button-tertiary-bg-color);
  border-radius: var(--box-border-radius);
  transition: color ${defaultTransitionProps},
    background-color ${defaultTransitionProps};

  &:hover,
  &:focus-visible {
    color: var(--strong-color);
    background-color: var(--color-accent-primary-light);
    outline: none;
  }
`;

export const MarkdownButton = styled(Button)`
  border-radius: var(--box-border-radius);
  margin-inline-start: auto;
`;
