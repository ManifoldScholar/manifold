import styled from "@emotion/styled";

export const Toc = styled.nav`
  font-family: var(--font-family-heading);
  background-color: var(--color-base-neutral10);
  color: var(--color-neutral-text-extra-dark);
  border-radius: 4px;
  overflow: hidden;
  padding-block: 10px;
`;

export const TocList = styled.ol`
  --toc-inline-start-padding: 32px;
  --toc-font-size: 20px;
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: var(--toc-font-size);
`;

export const TocEmpty = styled.p`
  font-family: var(--font-family-heading);
  font-style: italic;
  padding: 32px;
  margin: 0;
  color: var(--color-neutral-text-dark);
  background-color: var(--color-base-neutral10);
  border-radius: 4px;
`;
