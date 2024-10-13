import styled from "@emotion/styled";
import Collapse from "global/components/Collapse";
import { buttonUnstyled } from "theme/styles/mixins";

export const Toggle = styled(Collapse.Toggle)`
  ${buttonUnstyled}
  width: 100%;
  text-align: left;

  &:hover {
    color: var(--color);
  }
`;

/* eslint-disable prettier/prettier */
export const Item = styled.li``;
/* eslint-enable prettier/prettier */

export const Inner = styled.div`
  border: 0;
  padding-block-end: 20px;
`;

export const Subject = styled.span`
  max-width: 90%;
`;

export const MetaOne = styled.div`
  display: flex;
  gap: 12px;
`;

export const MetaTwo = styled.div`
  display: flex;
  gap: 12px;
  margin-block: 8px;

  > span + span::before {
    content: "|";
    margin-inline-end: 12px;
  }
`;

export const Content = styled(Collapse.Content)`
  position: relative;
  border-bottom: 1px solid var(--color-neutral-ui-dull-light);
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
    90%,
    var(--Overlay-bg)
  );
  transition: opacity var(--collapse-duration) ease var(--collapse-delay),
    visibility var(--collapse-duration);

  .collapse__content--visible & {
    opacity: 0;
  }
`;

export const Utility = styled.div`
  z-index: 5;
  margin-top: 25px;
`;
