import styled from "@emotion/styled";
import { listUnstyled, respond, formLabelPrimary } from "theme/styles/mixins";

export const MappableList = styled.ul`
  ${listUnstyled}
  max-height: 700px;
  padding: 0.8em;
  margin-top: 10px;
  overflow-y: scroll;
  font-size: 14px;
  background-color: var(--color-neutral-ui-extra-dark);

  ${respond(`margin-top: 15px;`, 50)}
  ${respond(`font-size: 16px;`, 90)}

  li + li {
    margin-top: calc(0.8em - 2px);
  }

  [data-rbd-placeholder-context-id] {
    height: 0 !important;
  }
`;

export const Available = styled.div`
  max-height: 700px;
  padding: 0.8em;
  margin-top: 10px;
  overflow-y: scroll;
  font-size: 14px;
  user-select: none;
  background-color: var(--color-base-neutral85);

  ${respond(`margin-top: 15px;`, 50)}
  ${respond(`font-size: 16px;`, 90)}
`;

export const ColumnMap = styled.div`
  ${respond(
    `
    display: flex;
    margin-left: -35px;
  `,
    80
  )}
`;

export const Column = styled.div`
  ${respond(`padding-left: 35px;`, 80)}

  & + & {
    margin-top: 30px;

    ${respond(`margin-top: 0;`, 80)}
  }
`;

export const ColumnMappable = styled(Column)`
  flex-grow: 1;
  width: 100%;
  ${respond(`width: calc(100% - 28vw);`, 80)}
  ${respond(`width: calc(100% - 29vw);`, 85)}
  ${respond(`width: calc(100% - 360px);`, 110)}
`;

export const ColumnHeading = styled.h4`
  ${formLabelPrimary}
  display: block;
  margin-top: 0;
  margin-bottom: 0.5em;
`;
