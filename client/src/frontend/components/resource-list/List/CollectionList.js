import { useTranslation } from "react-i18next";
import ListItem from "./ListItem/CollectionListItem";
import Utility from "global/components/utility";
import * as Styled from "./styles";

export default function ResourceCollectionList({
  collections,
  pagination,
  onPageChange,
  setActive,
  active
}) {
  const { t } = useTranslation();

  return (
    <Styled.Wrapper>
      <Styled.Count>
        {`${pagination?.totalCount} ${t("glossary.resource_collection", {
          count: pagination?.totalCount
        })}`}
      </Styled.Count>
      <Styled.List>
        {collections?.map(c => (
          <ListItem
            key={c.id}
            collection={c}
            active={active === c.id}
            setActive={setActive}
          />
        ))}
      </Styled.List>
      {pagination?.totalPages > 1 && (
        <Styled.PaginationWrapper>
          <Utility.Pagination
            pagination={pagination}
            paginationClickHandler={onPageChange}
            wide
          />
        </Styled.PaginationWrapper>
      )}
    </Styled.Wrapper>
  );
}
