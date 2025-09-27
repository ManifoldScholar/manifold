import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import BodyClass from "hoc/BodyClass";
import {
  buttonUnstyled,
  darken,
  containerPrototype,
  headingPrimary,
  headingTertiary
} from "theme/styles/mixins";

export const Body = styled(BodyClass)`
  display: flex;
  flex-direction: column;

  #content {
    flex-grow: 1;
    min-height: 100vh;
    min-height: 100dvh;
  }
`;

export const Wrapper = styled.section`
  --_gap: 1.5rem;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  min-height: 100dvh;
  padding-inline: var(--container-padding-inline-fluid);
  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);
  background-color: var(--color-base-red20);

  ${({ $contained }) =>
    $contained &&
    `
    --_Inner-box-shadow: none;
    --_Inner-border-thickness: 3px;

    min-height: auto;
    flex-grow: 1;
    background-color: transparent;
  `}
`;

export const Inner = styled.div`
  --container-width-full: 40rem;
  ${containerPrototype}
  display: flex;
  flex-direction: column;
  gap: var(--_gap);
  padding-inline: var(--container-padding-inline-fluid);
  padding-block-start: calc(0.75 * var(--container-padding-block-start));
  padding-block-end: calc(0.75 * var(--container-padding-block-end));
  background-color: var(--background-color);
  border-radius: var(--box-border-radius);
  border: var(--_Inner-border-thickness) solid var(--color-base-red45);
  box-shadow: var(
    --_Inner-box-shadow,
    0px 12px 32px 3px var(--color-base-red45)
  );
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--_gap);
  text-align: center;
`;

export const Icon = styled(IconComposer)`
  margin-bottom: calc(0.5 * var(--_gap));
  color: var(--error-color);
`;

export const Message = styled.p`
  ${headingPrimary}
  margin-block: 0;
  color: var(--strong-color);
`;

export const ErrorTitle = styled.h1`
  ${headingTertiary}
  font-family: var(--font-family-mono);
  text-wrap: balance;
`;

export const ErrorBody = styled.p`
  font-size: 14px;
  font-family: var(--font-family-mono);

  &:not(:first-child) {
    margin-block-start: 1em;
  }
`;

export const Link = styled.button`
  ${buttonUnstyled}
  margin-top: 10px;
  text-decoration-line: underline;
  cursor: pointer;
`;

export const Stacks = styled.div`
  margin-block: 0;
  font-family: var(--font-family-mono);

  & + & {
    margin-top: 50px;
  }
`;

export const StackTitle = styled.h2`
  margin-block: 0;
  text-align: center;
  font-size: 16px;
`;

export const Footnote = styled.div`
  font-size: 12px;
  text-align: center;
  text-wrap: pretty;
`;

export const LineList = styled.ol`
  margin-block: 0.75em 1em;
  background-color: var(--color-base-neutral05);
  font-size: 14px;
`;

export const Line = styled.li`
  padding: 0.75em 1em;

  &:nth-child(even) {
    background-color: ${darken("neutral05", 2.8)};
  }
`;

export const LineHighlight = styled.span`
  color: var(--error-color);
`;

export const LineLocation = styled.div`
  padding-top: 4px;
  font-size: 12px;
`;
