import styled from "@emotion/styled";
import { fluidScale, panelRounded } from "theme/styles/mixins";

export const SectionHeader = styled.h2`
  ${panelRounded}
  padding: 0.857em 1.643em 1em;
  margin-block: 50px 10px;
  font-size: ${fluidScale("14px", "13px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semibold);
  color: var(--strong-color);
  text-transform: uppercase;
  letter-spacing: 0.107em;
  background-color: var(--box-medium-bg-color);
`;
