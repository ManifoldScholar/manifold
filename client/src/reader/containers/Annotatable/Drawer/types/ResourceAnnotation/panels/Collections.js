import { useState } from "react";
import PropTypes from "prop-types";
import { projectsAPI } from "api";
import { useFetch, usePaginationState, useListFilters } from "hooks";
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
      <CollectionList
        collections={collections}
        pagination={collectionsMeta?.pagination}
        onPageChange={onPageChange}
        setActive={setSelected}
        active={selected?.id}
      />
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
