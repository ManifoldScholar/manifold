import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { projectsAPI } from "api";
import checkLibraryMode from "lib/react-router/loaders/checkLibraryMode";
import loadList from "lib/react-router/loaders/loadList";
import createListClientLoader from "lib/react-router/loaders/createListClientLoader";
import { useSettings } from "hooks";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import EntityCollectionPlaceholder from "components/global/entity/CollectionPlaceholder";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import HeadContent from "components/global/HeadContent";
import EntityCollection from "components/frontend/entity/Collection";
import { getJournalBreadcrumbs } from "helpers/breadcrumbs";

export const handle = { frontendMode: { isProjectSubpage: true } };

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  const fetchFn = (filters, pagination) =>
    projectsAPI.resourceCollections(params.id, filters, pagination);

  return loadList({
    request,
    context,
    fetchFn
  });
};

export const clientLoader = async ({ params, request, serverLoader }) => {
  const fetchFn = (filters, pagination) =>
    projectsAPI.resourceCollections(params.id, filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__projectResourceCollectionsHydrated",
    fetchFn
  });

  return clientLoaderFn({ request, serverLoader });
};

export default function ProjectResourceCollectionsRoute({ loaderData }) {
  const { data: resourceCollections, meta } = loaderData;
  const project = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug } = project?.attributes ?? {};

  const projectCrumb = {
    to: `/projects/${slug}`,
    label: titlePlaintext
  };
  const collectionsCrumb = {
    to: `/projects/${slug}/resource-collections`,
    label: t("glossary.resource_collection_other")
  };
  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;
  const breadcrumbs = journalBreadcrumbs
    ? [...journalBreadcrumbs, collectionsCrumb].filter(Boolean)
    : [projectCrumb, collectionsCrumb].filter(Boolean);

  const headContentProps = useEntityHeadContent(
    project,
    null,
    t("glossary.resource_collection_title_case_other")
  );

  return (
    <>
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
