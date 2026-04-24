import styled from "styled-components";
import { ListFilters as ListFiltersComponent } from "components/global/list";
import Form from "components/global/form";
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
      align-items: baseline;
    `,
    60
  )}
`;

export const Toggle = styled.div`
  margin-top: 0;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;

  ${respond(`justify-content: flex-end;`, 60)}

  .toggle-indicator {
    display: inline-block;
  }
`;

export const ListFilters = styled(ListFiltersComponent)`
  --input-font-family: var(--font-family-sans);

  flex-grow: 0;
  flex-basis: auto;
`;

export const Instructions = styled.div`
  ${formInstructions}
`;

export const Label = styled(Form.Label)`
  transform: translateY(-2px);
`;
