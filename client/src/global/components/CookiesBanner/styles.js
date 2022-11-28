import styled from "@emotion/styled";
import {
  headingPrimary,
  respond,
  formInstructions,
  fluidScale
} from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

export const Banner = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: var(--color-base-neutral110);
  z-index: 100;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: var(--container-width-full);
  padding-inline: var(--container-padding-inline-fluid);
  margin-inline: auto;
  padding-block: 60px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  ${respond(
    `flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    `,
    breakpoints[90]
  )}
`;

const copyStyles = `
  font-family: var(--font-family-copy);
  font-size: ${fluidScale("17px", "15px")};
  line-height: 24px;
  color: var(--color-base-neutral20);
`;

const copyLinkStyles = `
  a:hover,
  a:focus-visible {
    color: var(--color-accent-primary);
  }
`;

export const SelectionInner = styled.div`
  ${copyStyles}
  width: 100%;
  max-width: var(--container-width-full);
  padding-inline: var(--container-padding-inline-fluid);
  margin-inline: auto;
  padding-block: 80px;

  p {
    max-width: 100%;
    ${copyLinkStyles}

    ${respond(`max-width: 70%`, breakpoints[95])}
  }
`;

export const TextWrapper = styled.div`
  ${copyStyles}
  ${copyLinkStyles}
  ${respond(`max-width: 60%;`, breakpoints[90])}
`;

export const SelectionInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;

  ${respond(
    `flex-direction: row; justify-content: space-between; align-items: flex-end;d`,
    breakpoints[90]
  )}
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
  gap: 20px;

  ${respond(`padding-block-start: 3%;`, breakpoints[90])}
`;

export const Button = styled.button`
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

  ${respond(`max-width: 50%;`, breakpoints[90])}
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
