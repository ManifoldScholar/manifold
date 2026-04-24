import styled from "styled-components";
import { Link as LinkComponent } from "react-router";
import IconComposer from "components/global/utility/IconComposer";
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
