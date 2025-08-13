import styled from "@emotion/styled";
import { ListFilters } from "global/components/list";
import { respond } from "theme/styles/mixins";

export const Search = styled.div`
  display: flex;
  justify-content: space-between;
  padding-block-end: 24px;
`;

export const Filters = styled(ListFilters)`
  --Search-min-width: 172px;
  --SelectGroup-min-width: 160px;

  justify-content: space-between;

  > div {
    flex-grow: 0;
    flex-basis: 100%;

    ${respond(`flex-basis: 100px;`, 40)}
  }
`;
