import styled from "@emotion/styled";
import { fluidScale } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Option = styled.div`
  position: relative;
  padding: ${fluidScale("36px", "16px")};
  padding-block-start: ${fluidScale("30px", "14px")};
  background-color: var(--box-medium-bg-color);
  outline: 3px solid var(--box-medium-bg-color);
  border-radius: 16px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  transition: background-color var(--transition-duration-default),
    outline-color var(--transition-duration-default);

  > * + * {
    margin-block-start: 16px;
  }

  &:hover:not(:has(:disabled)),
  &:has(:focus-visible) {
    outline-color: var(--color-accent-primary);
  }

  &:has(:focus-visible) {
    outline-offset: 3px;
  }

  &:has(input:checked) {
    background-color: var(--color-accent-primary);
    outline-color: var(--color-accent-primary);
  }

  .reader.scheme-dark & {
    background-color: var(--color-base-neutral100);

    &:has(input:checked) {
      background-color: var(--color-accent-primary);
    }
  }

  &:has(input:disabled) {
    opacity: 0.4;
  }
`;

export const Input = styled.input`
  opacity: 0;
  position: absolute;
  z-index: 1;
  inset: 0;
  inline-size: 100%;
  block-size: 100%;
  margin: 0;

  &:not(:disabled) {
    cursor: pointer;
  }
`;

export const Description = styled.p`
  font-family: var(--font-family-sans);
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  text-align: center;
  filter: blur(7px);
  transition: blur 1s ease-in-out;
  color: var(--reader-color);

  input:checked ~ & {
    color: var(--color-base-neutral90);
  }

  ${({ $animating }) => $animating && `filter: blur(0px);`}
`;

export const Illustration = styled.figure`
  background-color: var(--color-base-neutral-white);
  border-radius: 12px;
  height: ${fluidScale("200px", "100px")};
  width: ${fluidScale("277px", "138px")};
  margin-inline: ${fluidScale("38px", "18px")};
  filter: blur(7px);
  transition: blur 1s ease-in-out;

  ${({ $animating }) => $animating && `filter: blur(0px);`}

  > svg {
    max-width: 100%;
    max-height: 100%;
  }
`;

export const Title = styled.label`
  color: var(--reader-color);
  font-size: ${fluidScale("26px", "20px")};
  margin: 0;

  input:checked + & {
    color: var(--color-base-neutral90);

    ::after {
      display: inline-block;
      content: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 -2 25 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M21.8067 3.75L10.1164 18.0169L3.08178 11.1475L2 12.2021L10.2432 20.25L23 4.68233L21.8067 3.75Z" fill="currentColor" stroke="currentColor" stroke-linejoin="round"/></svg>');
      width: 24px;
      height: 27px;
      margin-inline-start: 12px;
    }
  }
`;
