import styled from "@emotion/styled";
import Collapse from "global/components/Collapse";

// This isn't ideal, but I think it's a special case. Collapse.Content already adds two wrapping divs around the radio groups, so I didn't want to add a third to set the spacing. -LD
export const CollapseGroup = styled(Collapse.Content)`
  flex-basis: auto;
  inline-size: 100%;

  fieldset + fieldset {
    margin-block-start: var(--FieldGroup-row-gap);
  }

  ${({ $expanded }) =>
    $expanded && `margin-block-end: var(--FieldGroup-row-gap);`}
`;
