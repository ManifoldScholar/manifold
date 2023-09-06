import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { projectsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import EntitiesList, {
  Button,
  Search,
  ResourceCollectionRow
} from "backend/components/list/EntitiesList";
import withFilteredLists, {
  resourceCollectionFilters
} from "hoc/withFilteredLists";
import { usePaginationState, useSetLocation, useFetch } from "hooks";

function ProjectResourceCollectionsListContainer({
  project,
  entitiesListSearchProps,
  entitiesListSearchParams
}) {
  const { t } = useTranslation();

  const [pagination, setPageNumber] = usePaginationState(1, 10);

  const { data: resourceCollections, meta: resourceCollectionsMeta } = useFetch(
    {
      request: [
        projectsAPI.resourceCollections,
        project.id,
        entitiesListSearchParams.resourceCollections,
        pagination
      ],
      options: { requestKey: requests.beResourceCollections }
    }
  );

  useSetLocation({
    filters: entitiesListSearchParams.resourceCollections,
    page: pagination.number
  });

  if (!resourceCollections || !resourceCollectionsMeta) return null;

  return (
    <EntitiesList
      entityComponent={ResourceCollectionRow}
      title={t("projects.manage_resource_collections")}
      titleStyle="bar"
      titleTag="h2"
      entities={resourceCollections}
      unit={t("glossary.resource_collection", {
        count: resourceCollectionsMeta?.pagination?.totalCount
      })}
      pagination={resourceCollectionsMeta.pagination}
      showCount
      callbacks={{
        onPageClick: page => e => {
          e.preventDefault();
          setPageNumber(page);
        }
      }}
      search={<Search {...entitiesListSearchProps("resourceCollections")} />}
      buttons={[
        <Button
          path={lh.link("backendProjectResourceCollectionsNew", project.id)}
          text={t("resource_collections.add_button_label")}
          authorizedFor={project}
          authorizedTo="createResourceCollections"
          type="add"
        />
      ]}
      usesQueryParams
    />
  );
}

ProjectResourceCollectionsListContainer.displayName = "Project.CollectionsList";

ProjectResourceCollectionsListContainer.propTypes = {
  project: PropTypes.object,
  entitiesListSearchProps: PropTypes.func.isRequired,
  entitiesListSearchParams: PropTypes.object.isRequired
};

export default withFilteredLists(ProjectResourceCollectionsListContainer, {
  resourceCollections: resourceCollectionFilters()
});
