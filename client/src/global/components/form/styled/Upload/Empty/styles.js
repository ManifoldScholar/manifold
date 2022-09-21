import styled from "@emotion/styled";
import { utilityPrimary, formLabelPrimary } from "theme/styles/mixins";
import IconComposer from "global/components/utility/IconComposer";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  padding: 15px;
`;

export const Icon = styled(IconComposer)`
  display: block;
  color: var(--color-base-neutral-white);
`;

export const PrimaryText = styled.p`
  ${utilityPrimary}
  padding-bottom: 0;
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  line-height: 1.5em;
  text-align: center;
`;

export const SecondaryText = styled.p`
  ${formLabelPrimary}
  padding-bottom: 0;
  margin-top: 10px;
  line-height: 1.5em;
  text-align: center;
`;

export const Error = styled.span`
  display: block;
  margin-block-start: 10px;
  color: var(--error-color);
`;
