import styled from "@emotion/styled";

export const Header = styled.div`
  background-color: var(--color-base-neutral110);
  border: none;

  .browse &,
  .reader.scheme-light &,
  .bg-white & {
    background-color: var(--box-medium-bg-color);
  }
`;

const NavButton = styled.button`
  top: 9px;
  width: auto;
  height: auto;
  font-size: 16px;
  line-height: 1;
  text-indent: unset;
  background-color: transparent;
  border: none;
`;

export const Next = styled(NavButton)`
  right: 20px;
`;

export const Prev = styled(NavButton)`
  left: 20px;
`;

export const Month = styled.div`
  color: var(--strong-color);
`;
