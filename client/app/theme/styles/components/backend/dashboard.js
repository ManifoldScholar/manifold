import { respond } from "theme/styles/mixins";
import { dashboardLayoutBreakpoint } from "theme/styles/variables/crossComponent";

export default `
  .backend-dashboard {
    --gap: 42px;

    display: grid;
    grid-template-columns: 100%;
    grid-gap: var(--gap);
    padding-top: 0;

    ${respond(`--gap: 60px;`, 50)}

    ${respond(
      `
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        --gap: 7.6vw;
      `,
      dashboardLayoutBreakpoint
    )}

    ${respond(`--gap: 95px;`, 120)}
  }
`;
