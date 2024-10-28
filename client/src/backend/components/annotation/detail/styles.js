import styled from "@emotion/styled";
import Collapse from "global/components/Collapse";
import {
  listUnstyled,
  buttonUnstyled,
  linkUnstyled,
  formLabelPrimary
} from "theme/styles/mixins";

export const FlagsHeader = styled.h3`
  color: var(--error-color);
`;

export const FlagsList = styled.ul`
  ${listUnstyled}

  font-family: var(--font-family-heading);
  margin-block-end: 40px;
`;

export const FlagWrapper = styled.li`
  border-bottom: 1px solid;
  padding-bottom: 20px;

  & + & {
    margin-block-start: 20px;
  }
`;

export const FlagMeta = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: var(--font-family-copy);
  margin-block-end: 8px;
`;

export const FlagMessage = styled.p`
  font-size: var(--font-size-60);
`;

export const Toggle = styled(Collapse.Toggle)`
  ${buttonUnstyled}
  width: 100%;
  text-align: left;

  &:hover {
    color: var(--color);
  }
`;

export const Content = styled(Collapse.Content)`
  position: relative;
  border: 1px solid;
  padding: 8px;
  padding-inline: 12px;
  border-radius: 8px;
  margin-block-end: 40px;
  min-block-size: 200px;
`;

export const Body = styled.span`
  max-width: 90%;
  padding-block-end: 14px;
`;

export const Overlay = styled.div`
  --Overlay-bg: rgba(46, 46, 46, 1);
  --Overlay-bg-transparent: rgba(46, 46, 46, 0);

  .overlay-full & {
    --Overlay-bg: rgba(54, 54, 54, 1);
    --Overlay-bg-transparent: rgba(54, 54, 54, 0);
  }

  position: absolute;
  top: 0;
  left: 0;
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
`;

export const Creator = styled.div`
  display: flex;
  align-items: center;
`;

export const CreatorName = styled.div`
  > span {
    display: block;
  }

  > span + span {
    margin-block-start: 4px;
    font-style: italic;
    font-family: var(--font-family-copy);
  }
`;

export const Label = styled.dt`
  ${formLabelPrimary}
  margin-block-end: 20px;
`;

export const Item = styled.dd`
  margin-block-end: 30px;
  font-family: var(--font-family-heading);
  font-size: var(--font-size-60);

  a {
    ${linkUnstyled}
  }

  &:not(:last-child) {
    border-bottom: 1px solid;
    padding-block-end: 10px;
  }
`;
