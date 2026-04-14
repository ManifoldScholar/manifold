import styled from "@emotion/styled";
import { headingTertiary } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 0 4px 8px 4px;
`;

export const Label = styled.span`
  ${headingTertiary}
  font-style: normal;
  font-weight: 400;
  font-size: 17px;
  color: var(--input-color);
`;

export const Header = styled.div`
  padding-block-end: 6px;

  span {
    display: inline-block;
  }

  span + span {
    margin-block-start: 12px;
  }
`;

export const Description = styled.span`
  min-width: 175px;
`;

export const HotKey = styled.div``;

export const HotKeyLabel = styled.span`
  whitespace: nowrap;
`;

export const TextPlaceholder = styled.span`
  whitespace: nowrap;
  font-style: normal;
  display: inline-block;
`;

export const Key = styled.span`
  display: inline-flex;
  flex-wrap: nowrap;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  padding-block-start: 6px;
  padding-block-end: 10px;
  padding-inline: 10px;
  background-color: var(--background-color);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  border-radius: 4px;
  font-style: normal;
  line-height: 1;
`;

export const Keys = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: no-wrap;
  margin-block-start: 8px;
  align-items: center;
`;
