import styled from "@emotion/styled";
import { breakpoints } from "theme/styles/variables/media";
import { listUnstyled, respond, fluidShrink } from "theme/styles/mixins";

const breakpoint = breakpoints[60];
const maxGap = "30px";

export const Grid = styled.ul`
  ${listUnstyled}
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  grid-gap: ${fluidShrink(maxGap, breakpoint)};

  ${respond(`grid-template-columns: repeat(2, minmax(0, 1fr));`, breakpoint)}
`;
