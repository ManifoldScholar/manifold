import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import LoadingBlock from "global/components/loading-block";
import { uiFrontendModeActions } from "actions";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import EntityHeadContent from "frontend/components/entity/HeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollection from "frontend/components/composed/EntityCollection";
import {
  useFetch,
  usePaginationState,
  useFilterState,
  useSetLocation,
  useListFilters
} from "hooks";

export default function ProjectResourcesContainer({
  project,
  journalBreadcrumbs
}) {
  const [pagination, setPageNumber] = usePaginationState(1, 10);
  const [filters, setFilters] = useFilterState();
  const { id } = useParams();
  const { data: resources, meta } = useFetch({
    request: [projectsAPI.resources, id, filters, pagination]
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const action = uiFrontendModeActions.isProjectSubpage();
    dispatch(action);
  }, [dispatch]);

  useSetLocation({ filters, page: pagination.number });

  const filterProps = useListFilters({
    onFilterChange: param => setFilters({ newState: param }),
    initialState: filters,
    resetState: {},
    options: {
      sort: true,
      kinds: project.attributes.resourceKinds,
      tags: project.attributes.resourceTags
    }
  });

  const breadcrumbs = useMemo(() => {
    const projectCrumb = {
      to: lh.link("frontendProject", project.attributes.slug),
      label: project.attributes.titlePlaintext
    };
    const resourcesCrumb = {
      to: lh.link("frontendProjectResources", project.attributes.slug),
      label: t("glossary.resource_other")
    };
    return journalBreadcrumbs
      ? [...journalBreadcrumbs, resourcesCrumb].filter(Boolean)
      : [projectCrumb, resourcesCrumb].filter(Boolean);
  }, [
    journalBreadcrumbs,
    project.attributes.slug,
    project.attributes.titlePlaintext,
    t
  ]);

  if (!project) return <LoadingBlock />;

  return (
    <>
      <EntityHeadContent
        entity={project}
        titleOverride={`${t("glossary.resource_title_case_other")} | ${
          project.attributes.titlePlaintext
        }`}
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityCollection.ProjectResources
        project={project}
        resources={resources}
        resourcesMeta={meta}
        filterProps={filterProps}
        paginationProps={{
          paginationClickHandler: page => () => setPageNumber(page),
          paginationTarget: "#"
        }}
        itemHeadingLevel={3}
      />
    </>
  );
}

ProjectResourcesContainer.displayName =
  "Frontend.Containers.ProjectResourcesContainer";

ProjectResourcesContainer.propTypes = {
  project: PropTypes.object,
  journalBreadcrumbs: PropTypes.array
};
