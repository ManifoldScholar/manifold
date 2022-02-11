import React from "react";
import {
  useFetch,
  usePaginationState,
  useFromStore,
  useFilterState,
  useSetLocation
} from "hooks";
import { projectsAPI } from "api";
import HeadContent from "global/components/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollection from "frontend/components/composed/EntityCollection";
import LoadingBlock from "global/components/loading-block";

export default function EntityResourcesContainer({ entity, breadcrumbs }) {
  const settings = useFromStore("settings", "select");
  const [pagination, setPageNumber] = usePaginationState();
  const [filters, setFilters] = useFilterState();
  const { data: resources, meta } = useFetch({
    request: [projectsAPI.resources, entity.id, filters, pagination]
  });

  useSetLocation({ filters, page: pagination.number });

  if (!entity || !resources || !meta) return <LoadingBlock />;

  const { titlePlaintext, description, heroStyles } = entity.attributes ?? {};

  return (
    <div>
      <HeadContent
        title={`View \u201c${titlePlaintext}\u201d Resources on ${settings.attributes.general.installationName}`}
        description={description}
        image={heroStyles?.medium}
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityCollection.ProjectResources
        project={entity}
        resources={resources}
        resourcesMeta={meta}
        filterProps={{
          filterChangeHandler: param => setFilters({ newState: param }),
          initialFilterState: filters,
          resetFilterState: {}
        }}
        paginationProps={{
          paginationClickHandler: page => () => setPageNumber(page),
          paginationTarget: "#"
        }}
        itemHeadingLevel={3}
      />
    </div>
  );
}
