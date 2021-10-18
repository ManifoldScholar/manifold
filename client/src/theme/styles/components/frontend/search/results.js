import { breakpoints } from "theme/styles/variables/media";
import { fluidScale } from "theme/styles/mixins";

export default `
  .search-results-frontend {
    padding-bottom: ${fluidScale("110px", "48px")};

    .container {
      max-width: ${breakpoints[90]};
    }

    .search-results {
      padding-top: 40px;
    }
  }
`;
