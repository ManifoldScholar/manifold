import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import {
  linkUnstyled,
  defaultTransitionProps,
  respond
} from "theme/styles/mixins";

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 16px 30px;
  background-color: var(--color-base-neutral-white);
  color: var(--color-base-neutral90);
  display: grid;
  grid-template-columns: auto auto;
  gap: 16px;
  border-bottom: 1px solid var(--color-base-neutral40);

  ${respond(`grid-template-columns: 1fr auto 1fr;`, 60)}
`;

export const Logo = styled(Link)`
  ${linkUnstyled}
  display: flex;
  align-items: center;
  gap: 13px;
  font-weight: var(--font-weight-bold);
  width: max-content;
  transition: color ${defaultTransitionProps};

  &:hover {
    --__deep-linking-logo-bg: var(--color-base-neutral90);
    --__deep-linking-logo-fg: var(--color-base-neutral-white);

    color: var(--color-base-neutral70);
  }

  > svg {
    transition: color ${defaultTransitionProps};
  }
`;

export const Instance = styled.div`
  font-size: 19px;
  align-self: center;
  display: none;

  ${respond(`display: inline;`, 60)}
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;
