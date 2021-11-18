import styled from "@emotion/styled";
import { fluidScale } from "theme/styles/mixins";
import { Columns } from "./Parts/Columns/styles";

const sharedFooterStyles = `
  --input-color: var(--color-base-neutral45);
  --select-border-color: var(--input-color);
`;

export const DefaultFooter = styled.footer`
  ${sharedFooterStyles}
  padding-top: ${fluidScale("67px", "32px")};
`;

export const StandaloneFooter = styled.footer`
  ${sharedFooterStyles}
  padding-top: 22px;
`;

export const BrandedFooter = styled.footer`
  ${sharedFooterStyles}
  padding-top: ${fluidScale("67px", "32px")};

  ${Columns} + ${Columns} {
    margin-block-start: 30px;
  }
`;

export const ReaderFooter = styled.footer`
  ${sharedFooterStyles}
  padding-top: 0;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  > * {
    flex-grow: 1;
  }
`;
