import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { uiFrontendModeActions } from "actions";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import HeadContent from "global/components/HeadContent";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollection from "frontend/components/entity/Collection";
import { useFetch, useListFilters, useListQueryParams } from "hooks";

export default function ProjectResourcesContainer({
  project,
  journalBreadcrumbs
}) {
  const { id } = useParams();

  const { pagination, filters, setFilters } = useListQueryParams({
    initSize: 10
  });

  const { data: resources, meta } = useFetch({
    request: [projectsAPI.resources, id, filters, pagination]
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    const action = uiFrontendModeActions.isProjectSubpage();
    dispatch(action);
  }, [dispatch]);

  const { slug, resourceKinds, resourceTags, titlePlaintext } =
    project?.attributes ?? {};

  const filterProps = useListFilters({
    onFilterChange: state => setFilters(state),
    initialState: filters,
    resetState: null,
    options: {
      sort: true,
      kinds: resourceKinds,
      tags: resourceTags
    }
  });

  const breadcrumbs = useMemo(() => {
    const projectCrumb = {
      to: lh.link("frontendProject", slug),
      label: titlePlaintext
    };
    const resourcesCrumb = {
      to: lh.link("frontendProjectResources", slug),
      label: t("glossary.resource_other")
    };
    return journalBreadcrumbs
      ? [...journalBreadcrumbs, resourcesCrumb].filter(Boolean)
      : [projectCrumb, resourcesCrumb].filter(Boolean);
  }, [journalBreadcrumbs, slug, titlePlaintext, t]);

  const headContentProps = useEntityHeadContent(
    project,
    null,
    t("glossary.resource_title_case_other")
  );

  if (!project) return null;

  return (
    <>
      <HeadContent {...headContentProps} />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityCollection.ProjectResources
        project={project}
        resources={resources}
        resourcesMeta={meta}
        filterProps={filterProps}
        itemHeadingLevel={2}
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
