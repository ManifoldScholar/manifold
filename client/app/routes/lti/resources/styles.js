import styled from "@emotion/styled";
import { formLabelPrimary } from "theme/styles/mixins";

export const MetaLine = styled.p`
  ${formLabelPrimary}
  color: var(--color-neutral-text-dark);
  margin: 4px 0 16px;
`;

export const DetailText = styled.div`
  font-family: var(--font-family-copy);
  line-height: 1.6;
  color: var(--color-neutral-text-extra-dark);
  font-size: 15px;

  p {
    margin: 0 0 16px;
  }
`;
