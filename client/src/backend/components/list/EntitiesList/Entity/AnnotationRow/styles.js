import styled from "@emotion/styled";
import Collapse from "global/components/Collapse";
import { buttonUnstyled, respond } from "theme/styles/mixins";

export const Toggle = styled(Collapse.Toggle)`
  ${buttonUnstyled}
  width: 100%;
  text-align: left;

  &:hover {
    color: var(--color);
  }
`;

export const Item = styled.li`
  position: relative;
`;

export const Inner = styled.div`
  border: 0;
  padding-inline-end: 0;
  padding-block-end: 0;
  border-bottom: 1px solid var(--color-neutral-ui-dull-light);

  &:has(.collapse__content--hidden:not(.collapse__content--stub-only)) {
    border-bottom: 0px;
  }
`;

export const Text = styled.div`
  max-inline-size: 100%;
`;

export const Subject = styled.span`
  max-width: 90%;
  padding-block-end: 14px;
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

export const Content = styled(Collapse.Content)`
  position: relative;
`;

export const Overlay = styled.div`
  --Overlay-bg: rgba(247, 247, 247, 1);
  --Overlay-bg-transparent: rgba(247, 247, 247, 0);

  .overlay-full & {
    --Overlay-bg: rgba(236, 236, 236, 1);
    --Overlay-bg-transparent: rgba(236, 236, 236, 0);
  }

  .scheme-dark & {
    --Overlay-bg: rgba(46, 46, 46, 1);
    --Overlay-bg-transparent: rgba(46, 46, 46, 0);
  }

  .scheme-dark .overlay-full & {
    --Overlay-bg: rgba(54, 54, 54, 1);
    --Overlay-bg-transparent: rgba(54, 54, 54, 0);
  }

  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  opacity: 1;
  background: linear-gradient(
    var(--Overlay-bg-transparent),
    70%,
    var(--Overlay-bg)
  );
  transition: opacity var(--collapse-duration) ease var(--collapse-delay),
    visibility var(--collapse-duration);

  .collapse__content--visible & {
    opacity: 0;
  }

  border-bottom: 1px solid var(--color-neutral-ui-dull-light);
`;

export const Utility = styled.div`
  position: absolute;
  height: 120px;
  top: 0;
  right: 19px;
  z-index: 5;
  display: flex;
  align-items: center;
`;
