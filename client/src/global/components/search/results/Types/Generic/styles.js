import styled from "@emotion/styled";
import { respond, buttonUnstyled, utilityPrimary } from "theme/styles/mixins";
import { Link as LinkComponent } from "react-router-dom";
import Collapse from "global/components/Collapse";

export const Result = styled.li`
  padding: 29px 20px 32px;
  font-family: var(--font-family-copy);

  mark {
    background-color: var(--color-notification-warning-extra-light);
  }

  a,
  a:visited {
    color: var(--color-neutral-text-extra-dark);
    text-decoration: none;
  }

  a:hover {
    text-decoration-line: underline;
  }

  & + & {
    border-top: 1px solid var(--color-neutral-ui-dull-dark);
  }
`;

export const Inner = styled.article`
  display: flex;
`;

export const ImageCol = styled.div`
  display: none;
  padding-inline-end: 5px;

  ${respond(
    `
  display: block;
  padding-inline-end: 15px;
`,
    60
  )}
`;

export const Image = styled.figure`
  position: relative;
  width: 76px;
`;

export const TextCol = styled.div`
  width: 100%;
  color: var(--color-neutral-text-extra-dark);
`;

export const TextTop = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-block-end: 16px;
`;

export const TextTopLeft = styled.div`
  flex-grow: 1;
  padding-inline-end: 20px;
`;

export const TextTopRight = styled.div`
  display: flex;
  align-items: center;
  align-self: flex-start;
  margin-block-start: 2px;
  text-align: right;
  gap: 12px;
`;

export const Parent = styled.span`
  margin: 0 0 12px;
  font-size: 18px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
  color: var(--color-neutral-text-dark);

  a,
  a:visited {
    color: var(--color-netural-text-dark);
  }
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 21px;
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-semibold);
`;

export const Link = styled(LinkComponent)`
  display: block;
  margin: 0 0 16px;

  &:last-child {
    margin-block-end: 0;
  }
`;

export const Attribution = styled.div`
  font-family: var(--font-family-copy);
  font-style: normal;
  font-size: 18px;
`;

export const Label = styled.div`
  font-family: var(--font-family-sans);
  font-size: 12px;
  font-weight: var(--font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.075em;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  hyphens: none;
  color: var(--color-neutral-text-extra-dark);
  background-color: var(--color-base-neutral10);
  text-decoration: none;
  white-space: nowrap;
  border-radius: 3px;
`;

export const ToggleWrapper = styled.div`
  transform: translateY(-1px);
`;

export const Description = styled.p`
  margin-block-end: 16px;
  line-height: 23px;
  font-family: var(--font-family-copy);
`;

export const Meta = styled.p`
  font-style: italic;
`;

export const ExcerptsWrapper = styled.div`
  padding-block-start: 10px;
`;

export const Excerpt = styled.blockquote`
  margin: 0;
  font-size: 16px;
  line-height: 23px;
  border-left: 4px solid var(--color-neutral-ui-dull-dark);

  &:hover,
  &.focus-visible {
    background-color: var(--color-base-neutral05);
    outline: 0;
  }

  a {
    display: block;
    padding: 10px 31px 10px 28px;
  }

  a:hover {
    text-decoration: none;
  }

  & + & {
    margin-block-start: 25px;
  }
`;

export const Shim = styled.div`
  min-height: 25px;
`;

export const ExcerptToggle = styled(Collapse.Toggle)`
  ${buttonUnstyled}
  ${utilityPrimary}
  margin-block-start: 30px;
  font-size: 13px;
  font-weight: var(--font-weight-semibold);
  text-decoration-line: underline;
  color: var(--color-neutral-text-dark);
`;
