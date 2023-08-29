import React from "react";
import PropTypes from "prop-types";
import { readingGroupsAPI } from "api";
import { useParams } from "react-router-dom";
import EntityCollection from "frontend/components/entity/Collection";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useListFilters
} from "hooks";
import * as Styled from "./styles";

function ReadingGroupAnnotationsContainer({
  readingGroup,
  refresh,
  fetchVersion
}) {
  const [pagination, setPageNumber] = usePaginationState();
  const baseFilters = {};
  const [filters, setFilters] = useFilterState(baseFilters);
  useSetLocation({ filters, page: pagination.number });

  const { id } = useParams();

  const { data: annotations, meta } = useFetch({
    request: [readingGroupsAPI.annotations, id, filters, pagination],
    dependencies: [fetchVersion]
  });

  const { annotatedTexts: texts, readingGroupMemberships: memberships } =
    readingGroup?.relationships ?? {};

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    initialState: filters,
    resetState: baseFilters,
    options: { sortChron: true, memberships, texts }
  });

  const paginationClickHandlerCreator = page => {
    return event => {
      event.preventDefault();
      setPageNumber(page);
    };
  };

  return readingGroup ? (
    <Styled.Body>
      <EntityCollection.GroupAnnotations
        readingGroup={readingGroup}
        annotations={annotations}
        annotationsMeta={meta}
        filterProps={{ ...filterProps, hideSearch: true }}
        isFiltered={!!Object.keys(filters).length}
        paginationProps={{
          paginationClickHandler: paginationClickHandlerCreator
        }}
        refresh={refresh}
        nested
      />
    </Styled.Body>
  ) : null;
}

ReadingGroupAnnotationsContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  fetchVersion: PropTypes.number.isRequired
};

export default ReadingGroupAnnotationsContainer;
