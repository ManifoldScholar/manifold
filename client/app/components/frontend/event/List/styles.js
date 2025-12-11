import styled from "@emotion/styled";
import { listUnstyled, respond } from "theme/styles/mixins";
import { eventEntity } from "theme/styles/variables/crossComponent";

export const List = styled.ul`
  ${listUnstyled}
  display: grid;
  grid-template-columns: auto;
  grid-row-gap: ${eventEntity.rowGap};

  ${respond(
    `
      grid-template-columns: repeat(auto-fill, minmax(${eventEntity.minWidth}, 1fr));
      margin-left: -${eventEntity.iconSize.large};
    `,
    eventEntity.panelBreakpoint
  )}
`;

export const Item = styled.li`
  display: flex;
  flex-grow: 1;
  min-width: 100%;

  ${respond(
    `
    padding-left: ${eventEntity.iconSize.small};`,
    eventEntity.panelBreakpoint
  )}
`;
