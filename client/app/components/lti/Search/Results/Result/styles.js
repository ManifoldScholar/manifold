import styled from "styled-components";
import { Link } from "react-router";
import { linkUnstyled, defaultTransitionProps } from "theme/styles/mixins";

export const Title = styled(Link)`
  ${linkUnstyled}
  font-size: 19px;
  line-height: 1.21;
  transition: color ${defaultTransitionProps};

  &:is(a):hover {
    color: var(--color-base-neutral70);
    text-decoration: underline;
    text-underline-offset: 4px;
    text-decoration-thickness: 2px;
  }
`;

export const Box = styled.li`
  background-color: var(--color-base-neutral-white);
  border: 1px solid var(--color-base-neutral40);
  border-radius: 12px;
  padding: 24px;
  display: grid;
  grid-template-columns: minmax(min(20%, 80px), 80px) auto minmax(
      min(25%, 107px),
      105px
    );
  gap: 24px;

  &:has(a${Title}:hover) {
    outline: 2px solid var(--color-base-neutral90);
    border-color: var(--color-base-neutral-white);
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 16px;
`;

export const TextContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: var(--color-base-neutral90);
`;

export const TitleGroup = styled.div`
  margin-block-start: 20px;
  margin-block-end: 6px;
`;

export const Parent = styled.span`
  display: block;
  margin-block-end: 8px;
  font-size: 14px;
  line-height: 1.29;
  color: var(--color-neutral-text-dark);

  a {
    ${linkUnstyled}
    transition: color ${defaultTransitionProps};

    &:hover {
      color: var(--color-base-neutral90);
      text-decoration: underline;
      text-underline-offset: 3px;
      text-decoration-thickness: 2px;
    }
  }
`;

export const Subtitle = styled.span`
  font-family: var(--font-family-copy);
  font-style: italic;
  margin-block-end: 4px;
  line-height: 1.25;
`;

export const Byline = styled.div`
  display: flex;
  gap: 6px;
  font-family: var(--font-family-copy);
  line-height: 1.25;

  > span {
    font-style: italic;
  }
`;
