import styled from "@emotion/styled";
import {
  buttonUnstyled,
  utilityPrimary,
  textTruncate,
  rgba
} from "theme/styles/mixins";
import { collectableTypeVerticalPadding } from "../styles";

const shadowSize = `10px`;
const halfShadowSize = `5px`;

export const Header = styled.header`
  --label-margin-bottom: 18px;

  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  background-color: var(--box-medium-bg-color);
  border-top-left-radius: var(--box-border-radius);
  border-top-right-radius: var(--box-border-radius);
`;

export const Title = styled.h3`
  ${utilityPrimary}
  display: block;
  margin-block-end: var(--label-margin-bottom, 20px);
  font-size: 14px;
  color: var(--label-color);
  letter-spacing: 0.089em;
  ${textTruncate}
  margin-block-start: 16px;
`;

export const Actions = styled.div`
  display: flex;
  flex-shrink: 0;
  gap: min(1vw, 10px);
  align-items: center;
  margin-inline-start: 10px;
  color: var(--color);
`;

export const Action = styled.div`
  ${buttonUnstyled}
  ${utilityPrimary}
  font-size: 12px;
`;

export const Inner = styled.div`
  padding: calc(32px - ${collectableTypeVerticalPadding})
    clamp(20px, 2.857vw, 32px);
  padding-block-start: 40px;
  padding-block-end: 40px;
  box-shadow: inset 0 ${shadowSize} ${shadowSize} -${halfShadowSize} ${rgba("neutralBlack", 0.08)},
    inset 0 -${shadowSize} ${shadowSize} -${halfShadowSize}
      ${rgba("neutralBlack", 0.08)};
`;

export const Button = styled.button`
  ${buttonUnstyled}
  ${utilityPrimary}
  font-size: 12px;
`;

export const TypeHeaderText = styled.h4`
  ${utilityPrimary}
  display: block;
  margin-block-end: var(--label-margin-bottom, 20px);
  font-size: 14px;
  color: var(--label-color);
  letter-spacing: 0.089em;
  margin-block-start: 0;
  font-size: 13px;
  color: inherit;
`;
