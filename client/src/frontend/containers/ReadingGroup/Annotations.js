import { readingGroupsAPI } from "api";
import { useParams, useOutletContext } from "react-router-dom";
import EntityCollection from "frontend/components/entity/Collection";
import { useFetch, useListFilters, useListQueryParams } from "hooks";
import * as Styled from "./styles";

export default function ReadingGroupAnnotationsContainer() {
  const { readingGroup, refresh, fetchVersion } = useOutletContext() || {};
  const { pagination, filters, setFilters } = useListQueryParams({
    initFilters: {
      formats: ["annotation"]
    }
  });

  const { id } = useParams();

  const { data: annotations, meta, refresh: refreshAnnotations } = useFetch({
    request: [readingGroupsAPI.annotations, id, filters, pagination],
    dependencies: [fetchVersion]
  });

  const { annotatedTexts: texts, readingGroupMemberships: memberships } =
    readingGroup?.relationships ?? {};

  const filterProps = useListFilters({
    onFilterChange: state => setFilters(state),
    initialState: filters,
    resetState: null,
    options: { sortChron: true, memberships, texts }
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

ReadingGroupAnnotationsContainer.displayName =
  "Frontend.ReadingGroup.Annotations";
