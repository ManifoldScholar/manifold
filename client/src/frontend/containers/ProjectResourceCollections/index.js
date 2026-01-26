import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { entityStoreActions as store } from "actions";
import { useDispatch } from "react-redux";
import { useParams, useOutletContext } from "react-router-dom";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollectionPlaceholder from "global/components/entity/CollectionPlaceholder";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import EntityCollection from "frontend/components/entity/Collection";
import { useFetch, useListQueryParams } from "hooks";

export default function ProjectResourceCollectionsContainer() {
  const { project, journalBreadcrumbs } = useOutletContext() || {};
  const { id } = useParams();

  const { pagination } = useListQueryParams({ initSize: 10 });

  const { data: resourceCollections, meta, uid } = useFetch({
    request: [projectsAPI.resourceCollections, id, null, pagination]
  });
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    return () => dispatch(store.flush(uid));
  }, [dispatch, uid]);

  const { titlePlaintext, slug } = project?.attributes ?? {};

  const projectCrumb = {
    to: lh.link("frontendProject", slug),
    label: titlePlaintext
  };
  const collectionsCrumb = {
    to: lh.link("frontendProjectResourceCollections", slug),
    label: t("glossary.resource_collection_other")
  };
  const breadcrumbs = journalBreadcrumbs
    ? [...journalBreadcrumbs, collectionsCrumb].filter(Boolean)
    : [projectCrumb, collectionsCrumb].filter(Boolean);

  const headContentProps = useEntityHeadContent(
    project,
    null,
    t("glossary.resource_collection_title_case_other")
  );

  if (!project || !resourceCollections) return null;

  return (
    <>
      <CheckFrontendMode
        debugLabel="ProjectResourceCollections"
        isProjectSubpage
      />
      <HeadContent {...headContentProps} />
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
          itemHeadingLevel={2}
        />
      )}
    </>
  );
}

ProjectResourceCollectionsContainer.displayName =
  "Frontend.Containers.ProjectResourceCollections";
