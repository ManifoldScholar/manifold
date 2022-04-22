import styled from "@emotion/styled";
import { respond, subtitlePrimary, fluidScale } from "theme/styles/mixins";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-block-end: ${fluidScale("42px", "26px")};
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
  display: flex;
`;

export const Title = styled.h1`
  font-family: var(--font-family-heading);
  width: 100%;
  margin: 0;
  margin-block-end: 5px;
  font-size: 26px;
  font-weight: var(--font-weight-medium);
  hyphens: none;

  ${respond(`width: auto;`, 60)}
`;

export const ToggleWrapper = styled.span`
  margin-inline-start: 12px;
  transform: translateY(5px);
`;

export const DateWrapper = styled.span`
  ${subtitlePrimary}
  display: inline-block;
  width: 100%;
  font-size: ${fluidScale("20px", "16px")};
  margin-block-start: 12px;

  .bg-neutral90 & {
    color: var(--color-base-neutral40);
  }
`;
