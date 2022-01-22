import styled from "@emotion/styled";
import { ListFilters as ListFiltersComponent } from "global/components/list";
import { respond, formInstructions } from "theme/styles/mixins";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  justify-content: space-between;
  margin-bottom: 20px;

  ${respond(
    `
      flex-flow: row wrap;
      align-items: center;
    `,
    60
  )}

  .form-secondary {
    margin-top: 0;

    .form-input {
      display: flex;
      align-items: center;
      justify-content: space-between;

      ${respond(`justify-content: flex-end;`, 60)}

      .form-input-heading {
        margin-right: 12px;
        margin-bottom: 0;
        font-size: 13px;
        transform: translateY(-1px);
      }

      .toggle-indicator {
        display: inline-block;
      }
    }
  }
`;

export const ListFilters = styled(ListFiltersComponent)`
  flex-grow: 0;
  flex-basis: auto;
`;

export const Instructions = styled.div`
  ${formInstructions}
  font-size: 13px;
`;
