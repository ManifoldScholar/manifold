import styled from "@emotion/styled";

const tocBaseInlineStartPadding = "32px";

export const Subtitle = styled.p`
  color: var(--color-neutral-text-dark);
  margin: 0 0 24px;
  font-size: 16px;
  font-family: var(--font-family-copy);
`;

export const Empty = styled.p`
  color: var(--color-neutral-text-dark);
  font-style: italic;
  padding: 16px 4px;
  margin: 0;
`;

export const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  background: #fff;
  border: 1px solid var(--color-neutral-ui-dull-dark);
  border-radius: 4px;
  overflow: hidden;
`;

export const PagerWrap = styled.div`
  margin-top: 32px;
`;

export const Toc = styled.nav`
  font-family: var(--font-family-heading);
  background-color: var(--color-base-neutral10);
  color: var(--color-neutral-text-extra-dark);
  border-radius: 4px;
  overflow: hidden;
  padding-block: 10px;
`;

export const TocList = styled.ol`
  --toc-inline-start-padding: ${tocBaseInlineStartPadding};
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
