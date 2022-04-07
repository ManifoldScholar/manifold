import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { respond } from "theme/styles/mixins";

export const TextContainer = styled.div`
  display: flex;

  ${respond(`transform: translateY(-2px);`, 80)}
`;

export const Title = styled.h1`
  margin-block-end: 0;
  margin-inline-start: 15px;
  font-size: 23px;
  color: var(--strong-color);
  word-wrap: break-word;

  ${respond(`font-size: 26px;`, 80)}
`;

export const Icon = styled(IconComposer)`
  width: 32px;
  height: 32px;
  transform: translateY(2px);

  ${respond(`transform: translateY(4px);`, 80)}
`;
