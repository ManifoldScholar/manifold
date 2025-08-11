import styled from "@emotion/styled";
import { respond, subtitlePrimary, fluidScale } from "theme/styles/mixins";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--_spacing);
  text-decoration: none;
`;

export const Icon = styled.figure`
  display: none;
  padding-inline-end: 18px;

  ${respond(`display: inline-block;`, 60)}

  svg {
    fill: var(--color-base-neutral50);
  }
`;

export const TitleAndToggle = styled.div`
  flex-grow: 1;
  display: flex;
`;

export const Title = styled.h1`
  inline-size: fit-content;
  margin: 0;
  font-size: 26px;
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-medium);
  hyphens: none;
  color: var(--strong-color);

  ${respond(`width: auto;`, 60)}

  &:is(h2, h3) {
    font-size: ${fluidScale("23px", "17px")};
  }
`;

export const ToggleWrapper = styled.span`
  margin-inline-start: 12px;
  transform: translateY(3px);

  h2 ~ &,
  h3 ~ & {
    transform: translateY(1px);
  }
`;

export const DateWrapper = styled.p`
  ${subtitlePrimary}
  flex-basis: 100%;
  font-size: ${fluidScale("20px", "16px")};
  margin-block-start: 12px;

  .bg-neutral90 & {
    color: var(--color-base-neutral40);
  }
`;
