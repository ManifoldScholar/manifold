import styled from "@emotion/styled";
import { Link as LinkComponent } from "react-router-dom";
import IconComposer from "global/components/utility/IconComposer";
import { utilityPrimary } from "theme/styles/mixins";

export const Link = styled(LinkComponent)`
  ${utilityPrimary}
  display: flex;
  align-items: center;
  gap: 0.875em;
  text-decoration: none;
  font-size: 14px;
`;

export const Icon = styled(IconComposer)`
  width: 24px;
  height: 16px;
`;
