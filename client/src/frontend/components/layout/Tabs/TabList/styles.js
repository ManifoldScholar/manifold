import styled from "@emotion/styled";
import { respond } from "theme/styles/mixins";

export const TabList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  border-radius: 10px;

  ${respond(`flex-direction: row;`, 60)}
`;
