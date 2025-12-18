import styled from "@emotion/styled";
import { breakpoints } from "theme/styles/variables/media";
import { fluidScale, containerPrototype, respond } from "theme/styles/mixins";
import { Wrapper as ResultsList } from "global/components/search/results/styles";

export const FormWrapper = styled.div`
  padding: 60px 0 40px;
  background-color: var(--color-base-neutral05);

  header {
    padding-bottom: 25px;

    .title {
      font-family: var(--font-family-heading);
      margin: 0;
      font-size: 24px;
      font-weight: var(--font-weight-regular);
      color: var(--color-base-neutral75);
    }

    .subtitle {
      font-family: var(--font-family-copy);
      margin-top: 0.429em;
      font-size: 14px;
      font-style: italic;
      color: var(--color-base-neutral70);
    }
  }
  
  .search-query {
    input[type="text"] {
      background-color: var(--color-base-neutral-white);

      ${respond(`padding: 0.722em 1.111em 0.889em 57px;`, 60)}

      &::placeholder {
        color: inherit;
      }
    }
`;

export const ResultsWrapper = styled.div`
  padding-bottom: ${fluidScale("110px", "48px")};
`;

export const Inner = styled.div`
  ${containerPrototype}
  padding-block-start: var(--container-padding-block-start);
  padding-block-end: var(--container-padding-block-end);
  max-width: ${breakpoints[90]};

  > ${ResultsList} {
    padding-block-start: 40px;
  }
`;
