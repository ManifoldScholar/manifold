import styled from "styled-components";
import { Link } from "react-router";
import { linkUnstyled } from "theme/styles/mixins";

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 16px 30px;
  background-color: var(--color-base-neutral-white);
  color: var(--color-base-neutral90);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 16px;
  border-bottom: 1px solid var(--color-base-neutral40);
`;

export const Logo = styled(Link)`
  ${linkUnstyled}
  display: flex;
  align-items: center;
  gap: 13px;
  font-weight: var(--font-weight-bold);
  width: max-content;
`;

export const Instance = styled.div`
  font-size: 19px;
  align-self: center;
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
`;
