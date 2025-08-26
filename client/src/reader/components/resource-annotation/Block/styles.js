import styled from "@emotion/styled";
import { unselectable } from "../Marker/Sidebar/styles";
import Box from "global/components/atomic/Box";

export const Block = styled(Box)`
  margin-block: 1rem;

  ${unselectable}
`;
