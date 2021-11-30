import styled from "@emotion/styled";
import IconComposer from "global/components/utility/IconComposer";
import { respond, fluidScale } from "theme/styles/mixins";

const BREAKPOINT = 50;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.333em;
  padding: 36px 30px;
  text-align: center;
  font-size: ${fluidScale("19px", "16px")};
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-medium);
  color: var(--strong-color);
  background-color: var(
    --Warning-background-color,
    var(--color-notification-warning-extra-light)
  );
  border-radius: var(--box-border-radius);

  ${respond(
    `
      gap: 25px;
      flex-direction: row;
      text-align: start;
    `,
    BREAKPOINT
  )}
`;

export const Icon = styled(IconComposer)`
  flex-shrink: 0;
  color: var(--Warning-Icon-color, var(--warning-color));
`;

export const Content = styled.div`
  flex-grow: 1;
`;

export const Heading = styled.h3`
  margin: 0 0 0.333em;
  font-size: 1.105em;
  font-weight: var(--font-weight-regular);
`;

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.333em;
  margin-block-start: 0.333em;
  font-family: var(--font-family-copy);
  font-weight: var(--font-weight-regular);

  a:hover,
  a:visited {
    color: inherit;
  }
`;

export const Message = styled.p`
  > * + * {
    margin-block-start: 5px;
  }
`;

export const Note = styled.div`
  font-style: italic;

  i,
  em {
    font-style: normal;
  }
`;
