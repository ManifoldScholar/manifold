import styled from "@emotion/styled";
import Utility from "global/components/utility";
import { utilityPrimary, respond } from "theme/styles/mixins";

export const Info = styled.div`
  padding: 20px 60px;
  margin: auto;
  text-align: center;
`;

export const Icon = styled(Utility.IconComposer)`
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

export const Default = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  height: 100%;
  background-position: 50% 50%;
  background-size: cover;
`;
