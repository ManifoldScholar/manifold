import { utilityPrimary } from "theme/styles/mixins";

export default `
  .group-homepage-mode-toggle {
    label {
      ${utilityPrimary};
      display: flex;
      align-items: center;
      font-size: 12px;

      .toggle-indicator {
        margin-left: 1em;
      }
    }
  }
`;
