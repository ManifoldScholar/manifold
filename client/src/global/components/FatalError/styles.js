import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import BodyClass from "hoc/BodyClass";
import {
  buttonUnstyled,
  subtitlePrimary,
  darken,
  fluidScale,
  containerFocus
} from "theme/styles/mixins";

export const Body = styled(BodyClass)`
  display: flex;
  flex-direction: column;

  #content {
    flex-grow: 1;
    min-height: 100vh;
  }
`;

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  border: 20px solid var(--error-color);
`;

export const Inner = styled.div`
  padding: 10vh 4vh 4vh;
  vertical-align: middle;
`;

export const Container = styled.div`
  ${containerFocus}
  text-align: center;
`;

export const Icon = styled(IconComposer)`
  margin-bottom: 20px;
  color: var(--error-color);
`;

export const Header = styled.header`
  margin-bottom: 1.375em;
`;

export const Message = styled.h3`
  margin: 0;
  font-size: ${fluidScale("32px", "24px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-regular);
  line-height: 1.333;
  color: var(--color-base-neutral50);
`;

export const ErrorTitle = styled.h1`
  font-size: ${fluidScale("24px", "20px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-regular);
  color: var(--strong-color);
`;

export const ErrorBody = styled.p`
  ${subtitlePrimary}
  font-size: 18px;
  line-height: 1.421;
`;

export const Link = styled.button`
  ${buttonUnstyled}
  margin-top: 10px;
  text-decoration-line: underline;
  cursor: pointer;
`;

export const Stacks = styled.div`
  margin-top: 5vh;
  font-family: var(--font-family-mono);

  & + & {
    margin-top: 50px;
  }
`;

export const StackTitle = styled.h3`
  margin-bottom: 15px;
  text-align: center;
`;

export const Footnote = styled.div`
  font-size: 12px;
  font-style: italic;
  color: var(--color-base-neutral40);
  text-align: center;
`;

export const LineList = styled.ol`
  background-color: var(--color-base-neutral05);
  padding-inline-start: 50px;
`;

export const Line = styled.li`
  padding: 5px;

  &:nth-child(even) {
    background-color: ${darken("neutral05", 2.5)};
  }
`;

export const LineHighlight = styled.span`
  color: var(--error-color);
`;

export const LineLocation = styled.div`
  padding-top: 4px;
  font-size: 13px;
`;
