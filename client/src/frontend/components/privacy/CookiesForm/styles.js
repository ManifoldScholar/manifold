import styled from "@emotion/styled";
import { formInstructions } from "theme/styles/mixins";
import Form from "global/components/form";

export const FieldGroup = styled(Form.FieldGroup)`
  --FieldGroup-row-gap: 50px;
  --BaseGroup-flex-flow: column nowrap;
`;

export const Save = styled.input`
  width: 266px;
  margin-block-end: 20px;
  margin-block-start: 10px;
`;

export const NoAnalyticsMessage = styled.span`
  ${formInstructions}
  display: block;
`;
