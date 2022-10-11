import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const InputGroup = styled.div`
  display: flex;
  flex-flow: column wrap;

  ${respond(
    `
  flex-direction: row;
  justify-content: space-between;
`,
    90
  )}

  > .buttons-icon-horizontal, {
    ${respond(`flex-basis: 100%;`, 90)}
  }

  > * {
    flex: 0 1 auto;
    margin-top: 0;

    ${respond(`flex-basis: 47.64%;`, 90)}

    &.wide {
      ${respond(`flex-basis: 100%;`, 90)}
    }

    &.fourth {
      ${respond(`flex-basis: 23.82%;`, 90)}
    }

    &.third {
      ${respond(`flex-basis: 31.76%;`, 90)}
    }

    .form-select {
      width: 100%;
    }
  }
`;

export const InputGroupPrimary = styled(InputGroup)`
  > * {
    margin-bottom: 35px;

    ${respond(`margin-top: 18px;`, 90)}

    &:last-child {
      margin-bottom: 12px;
    }

    &.extra-space-bottom {
      margin-bottom: 32px;
    }
  }
`;

export const InputGroupSecondary = styled(InputGroup)`
  > * {
    margin-bottom: 25px;

    &:last-child {
      margin-bottom: 0;
    }
  }
`;
