import styled from "@emotion/styled";
import { fluidScale } from "theme/styles/mixins";

export const Wrapper = styled.article`
  --_spacing: ${fluidScale("30px", "20px")};

  display: flex;
  flex-direction: column;
  gap: var(--_spacing);

  > * + *:not(.resource-preview-description) {
    margin-block-start: ${fluidScale("20px", "0px")};
  }
`;

export const Footer = styled.footer``;
