import styled from "@emotion/styled";
import { utilityPrimary, respond, formInstructions } from "theme/styles/mixins";
import { breakpoints } from "theme/styles/variables/media";

export const Banner = styled.div`
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: var(--color-accent-primary-extra-pale);
  z-index: 100;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: var(--container-width-full);
  padding-inline: var(--container-padding-inline-fluid);
  margin-inline: auto;
  padding-block-start: 20px;
  padding-block-end: 26px;
  display: flex;
  flex-direction: column;
  gap: 30px;

  ${respond(
    `flex-direction: row;
    align-items: center;
    gap: 30px;
    `,
    breakpoints[90]
  )}

  ${({ $wide }) =>
    $wide && `justify-content: space-between; padding-block: 30px;`}
`;

export const TextWrapper = styled.div`
  font-family: var(--font-family-copy);
  font-size: 17px;
  color: var(--color-neutral-text-extra-dark);

  ${respond(`max-width: 60%;`, breakpoints[90])}
`;

export const Heading = styled.span`
  ${utilityPrimary}
  color: var(--color-base-neutral-black);
  font-size: 14px;
  display: block;
  margin-block-end: 12px;
`;

export const ButtonWrapper = styled.div`
  display: flex;
  gap: 20px;

  ${respond(`padding-block-start: 3%;`, breakpoints[90])}
`;

export const WhiteButton = styled.button`
  background-color: var(--color-base-neutral-white);
`;

export const Checkboxes = styled.div`
  display: flex;
  gap: 40px;
`;

export const CheckboxWrapper = styled.div`
  max-width: 60%;
`;

export const Description = styled.span`
  ${formInstructions}
  display: block;
  margin-block-start: 14px;
`;
