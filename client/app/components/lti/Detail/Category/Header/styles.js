import styled from "styled-components";
import { utilityPrimary } from "theme/styles/mixins";

export const Header = styled.header`
  display: flex;
  align-items: stretch;
  background-color: var(--color-base-neutral10);
  border: 1px solid var(--color-base-neutral40);
  border-radius: 8px;
  color: var(--color-base-neutral90);
`;

export const IconBlock = styled.div`
  display: flex;
  align-items: center;
  padding-inline: 12px;
  background-color: var(--color-base-neutral30);
`;

export const LabelBlock = styled.div`
  flex: 1 0 0;
  padding: 12px 16px;
`;

export const Label = styled.span`
  ${utilityPrimary}
  font-size: 14px;
  line-height: 1.5;
`;
