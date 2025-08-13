import { useState } from "react";
import PropTypes from "prop-types";
import { projectsAPI } from "api";
import { useFetch, usePaginationState, useListFilters } from "hooks";
import ResourceList from "frontend/components/resource-list/List";
import * as Styled from "./styles";

export default function ResourcesList({ projectId, selected, setSelected }) {
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
      <ResourceList
        resources={resources}
        pagination={resourcesMeta?.pagination}
        onPageChange={onPageChange}
        setActive={setSelected}
        active={selected?.id}
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
