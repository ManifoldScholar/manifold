import styled from "@emotion/styled";
import { fluidScale, respond } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

export const Box = styled.div`
  background-color: var(--color-base-neutral10);
  padding-inline: 24px;
  padding-block-start: 32px;
  padding-block-end: 27px;
  border-radius: 6px;
`;

export const Header = styled.h3`
  font-family: var(--font-family-heading);
  font-size: ${fluidScale("22px", "18px")};
  margin: 0;
  font-weight: var(--font-weight-medium);
  hyphens: none;
  line-height: 1.32;
  color: var(--highlight-color);
`;

export const Instructions = styled.span`
  font-size: ${fluidScale("18px", "15px")};
  line-height: ${fluidScale("22px", "19")};
  font-family: var(--font-family-copy);
  font-style: italic;
  display: block;
  margin-block-end: 32px;
  color: var(--highlight-color);
`;

export const EmailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 17px;

  ${respond(`flex-direction: row;`, breakpoints[50])}
`;

export const InputWrapper = styled.div`
  width: 100%;

  ${respond(`width: 49%;`, breakpoints[50])}
`;

export const EmailInput = styled.input`
  width: 100%;
  min-height: 43px;
  font-family: var(--font-family-heading);
  border: none;
  box-shadow: inset 0px -1px 0px var(--highlight-color);
  padding-block: 7px;
  padding-inline: 16px;
`;

export const Button = styled.button`
  padding-inline: 20px;
`;
