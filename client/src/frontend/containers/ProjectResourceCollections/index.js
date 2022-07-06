import React, { useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { entityStoreActions as store } from "actions";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import LoadingBlock from "global/components/loading-block";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import EntityHeadContent from "frontend/components/entity/HeadContent";
import EntityCollection from "frontend/components/entity/Collection";
import { useFetch, usePaginationState } from "hooks";

export default function ProjectResourceCollectionsContainer({
  project,
  journalBreadcrumbs
}) {
  const [pagination, setPageNumber] = usePaginationState(1, 10);
  const { id } = useParams();
  const { data: resourceCollections, meta, uid } = useFetch({
    request: [projectsAPI.resourceCollections, id, null, pagination]
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    return () => dispatch(store.flush(uid));
  }, [dispatch, uid]);

  const { titlePlaintext, slug } = project?.attributes ?? {};

  const breadcrumbs = useMemo(() => {
    const projectCrumb = {
      to: lh.link("frontendProject", slug),
      label: titlePlaintext
    };
    const collectionsCrumb = {
      to: lh.link("frontendProjectResourceCollections", slug),
      label: t("glossary.resource_collection_other")
    };
    return journalBreadcrumbs
      ? [...journalBreadcrumbs, collectionsCrumb].filter(Boolean)
      : [projectCrumb, collectionsCrumb].filter(Boolean);
  }, [journalBreadcrumbs, slug, titlePlaintext, t]);

  if (!project) return <LoadingBlock />;

  return (
    <>
      <CheckFrontendMode
        debugLabel="ProjectResourceCollections"
        isProjectSubpage
      />
      <EntityHeadContent
        entity={project}
        titleOverride={`${t(
          "glossary.resource_collection_title_case_other"
        )} | ${titlePlaintext}`}
      />
      <h1 className="screen-reader-text">
        {`${titlePlaintext} ${t("glossary.resource_collection_other")}`}
      </h1>
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      {!resourceCollections?.length ? (
        <EntityCollectionPlaceholder.ResourceCollections id={project.id} />
      ) : (
        <EntityCollection.ProjectResourceCollections
          resourceCollections={resourceCollections}
          resourceCollectionsMeta={meta}
          paginationProps={{
            paginationClickHandler: page => () => setPageNumber(page)
          }}
          itemHeadingLevel={2}
        />
      )}
    </>
  );
}

ProjectResourceCollectionsContainer.displayName =
  "Frontend.Containers.ProjectResourceCollections";

ProjectResourceCollectionsContainer.propTypes = {
  project: PropTypes.object,
  journalBreadcrumbs: PropTypes.array
};
