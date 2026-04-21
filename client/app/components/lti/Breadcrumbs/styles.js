import styled from "@emotion/styled";

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  font-family: var(--font-family-sans);
  font-size: 13px;
  min-width: 0;

  a {
    color: var(--color-neutral-text-dark);
    text-decoration: none;
    white-space: nowrap;
    max-width: 18rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  a:hover {
    color: var(--color-interaction-dark);
    text-decoration: underline;
  }

  > span {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    min-width: 0;
  }

  > span > span[aria-current="page"] {
    color: var(--color-neutral-text-extra-dark);
    font-weight: var(--font-weight-semibold);
    white-space: nowrap;
    max-width: 22rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const Separator = styled.span`
  color: var(--color-neutral-ui-dark);
  user-select: none;
`;
