import { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { projectsAPI } from "api";
import { useFetch, usePaginationState, useListFilters } from "hooks";
import Utility from "global/components/utility";
import CollectionList from "frontend/components/resource-list/List/CollectionList";
import ButtonGroup from "./ButtonGroup";
import * as Styled from "./styles";

export default function CollectionsList({
  projectId,
  selected,
  setSelected,
  handleSave,
  handleClose
}) {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({});

  const filterProps = useListFilters({
    onFilterChange: param => setFilters(param),
    initialState: filters,
    resetState: {},
    options: {
      entityType: "resourceCollection",
      sort: true
    }
  });

  const [pagination, setPage] = usePaginationState(1, 5);

  const { data: collections, meta: collectionsMeta } = useFetch({
    request: [projectsAPI.resourceCollections, projectId, filters, pagination]
  });

  const onPageChange = page => e => {
    e.preventDefault();
    setPage(page);
  };

  return (
    <div>
      <Styled.Search>
        <Styled.Filters {...filterProps} />
      </Styled.Search>
      <Styled.ListWrapper>
        <Styled.Count>
          {`${collectionsMeta?.pagination?.totalCount} ${t(
            "glossary.resource_collection",
            {
              count: collectionsMeta?.pagination?.totalCount
            }
          )}`}
        </Styled.Count>
        <CollectionList
          collections={collections}
          setActive={setSelected}
          active={selected?.id}
        />
        {collectionsMeta?.pagination?.totalPages > 1 && (
          <Styled.PaginationWrapper>
            <Utility.Pagination
              pagination={collectionsMeta?.pagination}
              paginationClickHandler={onPageChange}
              wide
            />
          </Styled.PaginationWrapper>
        )}
      </Styled.ListWrapper>
      <ButtonGroup
        handleSave={handleSave}
        handleClose={handleClose}
        selected={selected}
      />
    </div>
  );
}

CollectionsList.displayName =
  "Reader.Annotatable.Drawer.ResourceAnnotation.Collections";

CollectionsList.propTypes = {
  projectId: PropTypes.string,
  selected: PropTypes.object,
  setSelected: PropTypes.func
};
