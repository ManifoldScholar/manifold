import styled from "@emotion/styled";
import {
  headingPrimary,
  respond,
  formInstructions,
  fluidScale,
  formInputMessage
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";
import { transientOptions } from "helpers/emotionHelpers";

export const Banner = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: var(--color-base-neutral110);
  z-index: 500;
`;

const Inner = styled.div`
  width: 100%;
  max-width: var(--container-width-full);
  padding-inline: var(--container-padding-inline-fluid);
  margin-inline: auto;
  display: flex;
  flex-direction: column;
  gap: 30px;

  ${respond(
    `flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    gap: ${fluidScale("120px", "60px", 120, 90)};
    `,
    breakpoints[90]
  )}
`;

export const NarrowInner = styled(Inner)`
  padding-block: ${fluidScale("60px", "40px")};
`;

export const SelectionInner = styled(Inner)`
  padding-block: ${fluidScale("80px", "50px")};
`;

export const TextWrapper = styled.div`
  font-family: var(--font-family-copy);
  font-size: ${fluidScale("17px", "15px")};
  line-height: 24px;
  color: var(--color-base-neutral20);

  a:hover,
  a:focus-visible {
    color: var(--color-accent-primary);
  }
`;

export const Heading = styled.span`
  ${headingPrimary}
  font-size: ${fluidScale("30px", "24px")};
  color: var(--color-accent-primary);
  display: block;
  margin-block-end: 8px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  width: 310px;
  gap: 20px;
`;

export const Button = styled("button", transientOptions)`
  flex-shrink: 0;
  color: var(--color-base-neutral-white);
  border-color: ${({ $dull }) =>
    $dull ? `var(--color-base-neutral70)` : `var(--color-accent-primary)`};

  &:hover,
  &:focus-visible {
    color: var(--color-base-neutral110);
    background-color: ${({ $dull }) =>
      $dull ? `var(--color-base-neutral70)` : `var(--color-accent-primary)`};
    outline: 0;
  }
`;

export const Checkboxes = styled.div`
  margin-block-start: 32px;
`;

export const CheckboxWrapper = styled.div`
  & + & {
    margin-block-start: 20px;
  }
`;

export const Description = styled.span`
  ${formInstructions}
  display: block;
  margin-block-start: 14px;
`;

export const Error = styled.span`
  ${formInputMessage}
  display: inline-block;
  margin-block-end: 20px;
  color: var(--error-color);

  ${respond(`width: 310px;`, breakpoints[90])}
`;
