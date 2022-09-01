import styled from "@emotion/styled";
import { headingPrimary } from "theme/styles/mixins";

export const Box = styled.div`
  background-color: var(--color-base-neutral10);
  padding: 24px;
  border-radius: 6px;
`;

export const Header = styled.h4`
  ${headingPrimary}
`;

export const Instructions = styled.span``;

export const EmailWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 17px;
`;

export const EmailInput = styled.input``;
