import styled from "@emotion/styled";
import TotalComponent from "global/components/composed/EntityListTotal";
import { respond } from "theme/styles/mixins";

export const EntityListTotal = styled(TotalComponent)`
  --EntityListTotal-margin-block-end: 0;

  ${respond(`--EntityListTotal-margin-block-end: 25px;`, 60)}
`;
