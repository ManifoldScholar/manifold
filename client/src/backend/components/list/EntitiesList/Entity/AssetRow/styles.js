import styled from "@emotion/styled";
import { fluidScale, utilityPrimary, respond } from "theme/styles/mixins";

export const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-inline-start: ${fluidScale("25px", "12px")};
  flex-wrap: wrap;
  max-width: 100px;
  margin-inline-start: auto;

  ${respond(`flex-wrap: nowrap; max-width: none;`, 50)}
`;

export const CopyButton = styled.button`
  ${utilityPrimary}
  padding-inline: 10px;
  padding-block-start: 5px;
  padding-block-end: 6px;
  font-size: 13px;
  flex-grow: 0;

  > span {
    padding: 0;
  }
`;

export const CopyLabel = styled.span`
  display: none;

  ${respond(`display: inline;`, 40)}
`;

export const CopyLabelMobile = styled.span`
  ${respond(`display: none;`, 40)}
`;

export const IconWrapper = styled.div`
  width: 48px;
  height: 48px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  flex-shrink: 0;
  box-sizing: content-box;

  > * {
    flex-shrink: 0;
  }

  img {
    object-fit: contain;
    max-height: 100%;
  }

  svg {
    position: relative;
    width: 100%;
  }
`;

export const TruncateURL = styled.span`
  display: inline-block;
  width: ${fluidScale("620px", "150px")};
  white-space: nowrap;
  text-overflow: ellipsis;
  word-break: break-all;
  overflow: hidden;
`;
