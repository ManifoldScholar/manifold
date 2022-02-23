import React from "react";
import PropTypes from "prop-types";
import { readingGroupsAPI } from "api";
import { useParams } from "react-router-dom";
import EntityCollection from "frontend/components/composed/EntityCollection";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useListFilters
} from "hooks";

function ReadingGroupAnnotationsContainer({ readingGroup }) {
  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = {};
  const [filters, setFilters] = useFilterState(baseFilters);
  useSetLocation({ filters, page: pagination.number });

  const { id } = useParams();

  const { data: annotations, meta } = useFetch({
    request: [readingGroupsAPI.annotations, id, filters, pagination]
  });

  const { annotatedTexts: texts, readingGroupMemberships: memberships } =
    readingGroup?.relationships ?? {};

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    initialState: filters,
    resetState: baseFilters,
    options: { memberships, texts }
  });

  return readingGroup ? (
    <div className="group-page-body">
      <EntityCollection.GroupAnnotations
        readingGroup={readingGroup}
        annotations={annotations}
        annotationsMeta={meta}
        filterProps={{ ...filterProps, hideSearch: true }}
        isFiltered={!!Object.keys(filters).length}
        paginationProps={{
          paginationClickHandler: page => () => setPageNumber(page),
          paginationTarget: "#"
        }}
        nested
      />
    </div>
  ) : null;
}

ReadingGroupAnnotationsContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired
};

export default ReadingGroupAnnotationsContainer;
