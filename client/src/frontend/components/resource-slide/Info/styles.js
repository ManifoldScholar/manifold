import styled from "@emotion/styled";
import IconComputed from "global/components/icon-computed";
import { utilityPrimary, respond } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Wrapper = styled("div", transientOptions)`
  padding: 20px 60px;
  margin: auto;
  text-align: center;

  ${({ $background }) =>
    $background &&
    `
    background-color: var(--color-base-neutral90);
    opacity: 0.75;
  `}
`;

export const Icon = styled(IconComputed.Resource)`
  margin-bottom: 4px;

  ${respond(
    `
    width: 21.34vw;
    height: 21.34vw;`,
    50
  )}

  ${respond(
    `
    width: 220px;
    height: 220px;`,
    120
  )}
`;

export const Kind = styled.span`
  ${utilityPrimary}
  display: block;
  padding-bottom: 6px;
  font-size: 21px;
  font-weight: var(--font-weight-regular);
`;

export const Date = styled.span`
  ${utilityPrimary}
  font-size: 12px;
`;
