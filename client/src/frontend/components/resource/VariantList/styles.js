import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { listUnstyled, utilityPrimary, respond } from "theme/styles/mixins";

export const Container = styled.section`
  ${listUnstyled}
  ${utilityPrimary}
  display: block;
  font-size: 13px;

  ${respond(`margin-block-end: 25px;`, 65)}
`;

export const Title = styled.div`
  margin-block-end: 10px;
`;

export const List = styled.ul`
  ${listUnstyled}
`;

export const Item = styled.li`
  white-space: nowrap;

  & + & {
    margin-block-start: 10px;
  }
`;

export const Link = styled.a`
  display: inline-flex;
  align-items: center;
  color: var(--color-neutral-text-extra-dark);
  text-decoration: none;
`;

export const LinkIcon = styled(IconComposer)`
  position: relative;
  top: 1px;
  margin-inline-end: 6px;
  margin-inline-start: -1px;
  color: var(--hover-color);
`;

export const LinkText = styled.span`
  white-space: pre-wrap;
`;
