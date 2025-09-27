import styled from "@emotion/styled";
import { fluidScale } from "theme/styles/mixins";

export const Wrapper = styled.div`
  --_spacing: ${fluidScale("30px", "20px")};

  display: flex;
  flex-direction: column;
  gap: var(--_spacing);
`;

export const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: space-between;
`;
