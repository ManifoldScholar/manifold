import styled from "@emotion/styled";

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

export const ExpandableList = styled(List)``;

export const PagerWrap = styled.div`
  margin-top: 32px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 8px;

  h1 {
    margin: 0;
  }
`;
