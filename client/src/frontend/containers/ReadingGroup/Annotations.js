import React from "react";
import PropTypes from "prop-types";
import { readingGroupsAPI } from "api";
import { useParams } from "react-router-dom";
import EntityCollection from "frontend/components/entity/Collection";
import { useFetch, useListFilters, useListQueryParams } from "hooks";
import * as Styled from "./styles";

function ReadingGroupAnnotationsContainer({
  readingGroup,
  refresh,
  fetchVersion,
}) {
  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: {
      formats: ["annotation"],
    },
  });

  const { id } = useParams();

  const {
    data: annotations,
    meta,
    refresh: refreshAnnotations,
  } = useFetch({
    request: [readingGroupsAPI.annotations, id, filters, pagination],
    dependencies: [fetchVersion],
  });

  const { annotatedTexts: texts, readingGroupMemberships: memberships } =
    readingGroup?.relationships ?? {};

  const filterProps = useListFilters({
    onFilterChange: (state) => setFilters(state),
    initialState: filters,
    resetState: null,
    options: { sortChron: true, memberships, texts },
  });

  return readingGroup ? (
    <Styled.Body>
      <EntityCollection.GroupAnnotations
        readingGroup={readingGroup}
        annotations={annotations}
        annotationsMeta={meta}
        filterProps={{ ...filterProps, hideSearch: true }}
        isFiltered={!!Object.keys(filters).length}
        refreshGroup={refresh}
        refreshAnnotations={refreshAnnotations}
        nested
      />
    </Styled.Body>
  ) : null;
}

ReadingGroupAnnotationsContainer.propTypes = {
  readingGroup: PropTypes.object.isRequired,
  refresh: PropTypes.func.isRequired,
  fetchVersion: PropTypes.number.isRequired,
};

export default ReadingGroupAnnotationsContainer;
