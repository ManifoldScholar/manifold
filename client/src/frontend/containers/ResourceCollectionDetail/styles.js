import styled from "@emotion/styled";
import {
  containerPrototype,
  fluidScale,
  panelRounded
} from "theme/styles/mixins";

export const Annotations = styled.div`
  ${containerPrototype}
  padding-block-end: var(--container-padding-block-end);
`;

export const AnnotationsHeader = styled.h2`
  ${panelRounded}
  padding: 0.857em 1.643em 1em;
  margin-top: 0;
  margin-bottom: 0;
  font-size: ${fluidScale("14px", "13px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-semibold);
  color: var(--strong-color);
  text-transform: uppercase;
  letter-spacing: 0.107em;
  background-color: var(--box-medium-bg-color);
`;

export const EmptyMessage = styled.p`
  padding-block: 30px;
  font-family: var(--font-family-heading);
`;
