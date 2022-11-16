import styled from "@emotion/styled";
import { formInstructions } from "theme/styles/mixins";
import Form from "global/components/form";

export const FieldGroup = styled(Form.FieldGroup)`
  --FieldGroup-row-gap: 50px;
  --BaseGroup-flex-flow: column nowrap;

  margin-block-start: 40px;
  margin-block-end: 50px;

  > header {
    color: var(--color-base-neutral-white);
    background-color: var(--color-base-neutral100);
  }
`;

export const NoAnalyticsMessage = styled.span`
  ${formInstructions}
  display: block;
`;
