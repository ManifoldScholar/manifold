import styled from "@emotion/styled";

export const Header = styled.div`
  background-color: var(--color-base-neutral110);
  border: none;
  text-align: center;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
  padding-top: 8px;
  position: relative;

  .browse &,
  .reader.scheme-light &,
  .bg-white & {
    background-color: var(--box-medium-bg-color);
  }
`;

const NavButton = styled.button`
  position: absolute;
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
  margin-top: 0;
  font-weight: bold;
  font-size: 0.944rem;
`;
