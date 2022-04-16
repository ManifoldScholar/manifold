import styled from "@emotion/styled";
import { respond, subtitlePrimary } from "theme/styles/mixins";

export const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding-top: 23px;
  padding-bottom: 26px;
  text-decoration: none;
`;

export const Icon = styled.figure`
  display: none;
  padding-right: 18px;

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
  margin-bottom: 5px;
  font-size: 26px;
  font-weight: var(--font-weight-medium);
  hyphens: none;

  ${respond(`width: auto;`, 60)}
`;

export const ToggleWrapper = styled.span`
  margin-left: 12px;
  transform: translateY(5px);
`;

export const DateWrapper = styled.span`
  ${subtitlePrimary}
  width: 100%;
  font-size: 16px;

  .bg-neutral90 & {
    color: var(--color-base-neutral40);
  }
`;
