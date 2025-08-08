import { useTranslation } from "react-i18next";
import ListItem from "./ListItem";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default function ResourceList({
  resources,
  pagination,
  onPageChange,
  setActive,
  active
}) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <Styled.Count>
        {`${pagination?.totalCount} ${t("glossary.resource", {
          count: pagination?.totalCount
        })}`}
      </Styled.Count>
      <Styled.List>
        {resources?.map(r => (
          <ListItem
            key={r.id}
            resource={r}
            active={active === r.id}
            setActive={setActive}
          />
        ))}
      </Styled.List>
      <Styled.PaginationWrapper>
        <Utility.Pagination
          pagination={pagination}
          paginationClickHandler={onPageChange}
          wide
        />
      </Styled.PaginationWrapper>
    </Styled.Wrapper>
  );
}
