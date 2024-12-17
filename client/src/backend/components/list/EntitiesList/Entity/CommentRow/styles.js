import styled from "@emotion/styled";
import { linkUnstyled, respond } from "theme/styles/mixins";
import { Link as RouterLink } from "react-router-dom";

export const Item = styled.li`
  position: relative;
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid;
`;

export const Inner = styled.div`
  inline-size: 100%;
`;

export const Link = styled(RouterLink)`
  ${linkUnstyled}
  display: block;
  margin-block-start: 12px;

  &:hover {
    color: var(--color);
  }
`;

export const Body = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-inline-size: 95%;
  font-weight: var(--font-weight-medium);

  a &:hover {
    text-decoration: underline;
  }
`;

export const MetaOne = styled.div`
  display: flex;
  gap: 12px;
`;

export const MetaTwo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-block: 8px;
  max-inline-size: 100%;

  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    max-inline-size: 80%;
  }

  ${respond(
    `
    flex-direction: row;
    gap: 12px;

    > * {
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-inline-size: 50%;
    }

    > * + *::before {
      content: "|";
      margin-inline-end: 12px;
    }
    `,
    50
  )};
`;
