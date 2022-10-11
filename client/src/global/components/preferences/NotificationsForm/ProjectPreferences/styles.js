import styled from "@emotion/styled";
import Collapse from "global/components/Collapse";

// This isn't ideal, but I think it's a special case. Collapse.Content already adds two wrapping divs around the radio groups, so I didn't want to add a third to set the spacing. -LD
export const CollapseGroup = styled(Collapse.Content)`
  fieldset + fieldset {
    margin-block-start: 35px;
    padding-block-end: 60px;
  }

  ${({ $expanded }) => !$expanded && `margin-block-start: 0;`}
`;
