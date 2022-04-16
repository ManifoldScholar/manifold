import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { listUnstyled, utilityPrimary, respond } from "theme/styles/mixins";
import { transientOptions } from "helpers/emotionHelpers";

export const Container = styled("section", transientOptions)`
  ${listUnstyled}
  ${utilityPrimary}
  display: none;
  font-size: 13px;

  ${respond(`display: block;`, 65)}

  ${({ $isMobile }) =>
    $isMobile &&
    `
    display: block;
    margin-bottom: 25px;
    `}
`;

export const Title = styled.div`
  margin-bottom: 10px;
`;

export const List = styled.ul`
  ${listUnstyled}
`;

export const Item = styled.li`
  white-space: nowrap;

  & + & {
    margin-top: 10px;
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
  margin-right: 6px;
  margin-left: -1px;
  color: var(--hover-color);
`;

export const LinkText = styled.span`
  white-space: pre-wrap;
`;
