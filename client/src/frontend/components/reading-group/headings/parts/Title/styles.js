import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import AtomicTag from "global/components/atomic/Tag";
import { respond } from "theme/styles/mixins";

export const TextContainer = styled.div`
  display: flex;
  gap: 15px;

  ${respond(`transform: translateY(-2px);`, 80)}
`;

export const Title = styled.h1`
  margin-block-end: 0;
  font-size: 23px;
  color: var(--strong-color);
  word-wrap: break-word;

  ${respond(`font-size: 26px;`, 80)}
`;

export const Warning = styled.div`
  margin-block-end: 0;
  font-size: 16px;
  color: var(--error-color);
  word-wrap: break-word;

  ${respond(`font-size: 18px;`, 80)}
`;

export const Icon = styled(IconComposer)`
  width: 32px;
  height: 32px;
  transform: translateY(2px);

  ${respond(`transform: translateY(4px);`, 80)}
`;

export const Tag = styled(AtomicTag)`
  align-self: baseline;
  transform: translateY(8px);
`;
