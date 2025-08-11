import { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { projectsAPI } from "api";
import { useFetch, usePaginationState, useListFilters } from "hooks";
import Utility from "global/components/utility";
import ResourceList from "frontend/components/resource-list/List";
import ButtonGroup from "./ButtonGroup";
import * as Styled from "./styles";

export default function ResourcesList({
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
    options: {
      entityType: "resource",
      sort: true
    }
  });

  const [pagination, setPage] = usePaginationState(1, 5);

  const { data: resources, meta: resourcesMeta } = useFetch({
    request: [projectsAPI.resources, projectId, filters, pagination]
  });

  const onPageChange = page => e => {
    e.preventDefault();
    setPage(page);
  };

  return (
    <div>
      <Styled.Search>
        <Styled.Filters as="div" {...filterProps} />
      </Styled.Search>
      <Styled.ListWrapper>
        <Styled.Count>
          {`${resourcesMeta?.pagination?.totalCount} ${t("glossary.resource", {
            count: resourcesMeta?.pagination?.totalCount
          })}`}
        </Styled.Count>
        <ResourceList
          resources={resources}
          setActive={setSelected}
          active={selected?.id}
        />
        {resourcesMeta?.pagination?.totalPages > 1 && (
          <Styled.PaginationWrapper>
            <Utility.Pagination
              pagination={resourcesMeta?.pagination}
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

ResourcesList.displayName =
  "Reader.Annotatable.Drawer.ResourceAnnotation.Resources";

ResourcesList.propTypes = {
  projectId: PropTypes.string,
  selected: PropTypes.object,
  setSelected: PropTypes.func
};
