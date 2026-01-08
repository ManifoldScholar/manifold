import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { resourceCollectionsAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import HeadContent from "global/components/HeadContent";
import EntityCollection from "frontend/components/entity/Collection";
import ResourceCollectionAnnotations from "frontend/components/resource-collection/Annotations";
import { useListSearchParams, useListFilters } from "hooks";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import loadList from "app/routes/utility/loaders/loadList";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import { queryApi } from "app/routes/utility/helpers/queryApi";
import { useSettings } from "hooks";
import { getJournalBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";

const DEFAULT_FILTERS = {};

const getBreadcrumbs = ({ journalBreadcrumbs, collection, project, t }) => {
  const projectCrumb = {
    to: `/projects/${project.attributes.slug}`,
    label: project.attributes.titlePlaintext
  };
  const resourcesCrumb = {
    to: `/projects/${project.attributes.slug}/resource-collections`,
    label: t("glossary.resource_collection_other")
  };
  const collectionCrumb = collection
    ? {
        to: `/projects/${project.attributes.slug}/resource-collection/${collection.attributes.slug}`,
        label: collection.attributes.title
      }
    : null;
  return journalBreadcrumbs
    ? [...journalBreadcrumbs, resourcesCrumb, collectionCrumb].filter(Boolean)
    : [projectCrumb, resourcesCrumb, collectionCrumb].filter(Boolean);
};

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  const { resourceCollectionId } = params;

  const [resourcesResult, annotationsResult] = await Promise.allSettled([
    loadList({
      request,
      context,
      fetchFn: (filters, pagination) =>
        resourceCollectionsAPI.collectionResources(
          resourceCollectionId,
          filters,
          pagination
        ),
      options: {
        defaultFilters: DEFAULT_FILTERS
      }
    }),
    queryApi(
      resourceCollectionsAPI.annotations(resourceCollectionId, undefined, {
        number: 1,
        size: 5
      }),
      context
    )
  ]);

  const resourcesData =
    resourcesResult.status === "fulfilled" ? resourcesResult.value : null;
  const annotationsData =
    annotationsResult.status === "fulfilled" ? annotationsResult.value : null;

  return {
    ...resourcesData,
    initialAnnotations: annotationsData?.data ?? [],
    initialAnnotationsMeta: annotationsData?.meta ?? null
  };
};

export const clientLoader = async ({ params, request, serverLoader }) => {
  const { resourceCollectionId } = params;

  const fetchFn = (filters, pagination) =>
    resourceCollectionsAPI.collectionResources(
      resourceCollectionId,
      filters,
      pagination
    );

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__resourceCollectionResourcesHydrated",
    fetchFn,
    options: {
      defaultFilters: DEFAULT_FILTERS
    }
  });

  return clientLoaderFn({ request, serverLoader });
};

export default function ResourceCollectionDetailRoute({ loaderData }) {
  const { project, collection } = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { data: resources, meta, initialAnnotations, initialAnnotationsMeta } =
    loaderData || {};

  const { filters, setFilters } = useListSearchParams({
    defaultFilters: DEFAULT_FILTERS
  });

  const filterProps = useListFilters({
    onFilterChange: param => setFilters(param),
    initialState: filters,
    resetState: DEFAULT_FILTERS,
    options: {
      sort: true,
      kinds: collection?.attributes.resourceKinds,
      tags: collection?.attributes.resourceTags
    }
  });

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;

  const headContentProps = useEntityHeadContent(collection, project);

  const breadcrumbs = getBreadcrumbs({
    project,
    collection,
    journalBreadcrumbs,
    t
  });

  return (
    <>
      <CheckFrontendMode
        debugLabel="ResourceCollectionDetail"
        isProjectSubpage
      />
      <HeadContent {...headContentProps} />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityCollection.ProjectResourceCollectionDetail
        resourceCollection={collection}
        resources={resources}
        project={project}
        meta={meta}
        filterProps={filterProps}
      />
      <ResourceCollectionAnnotations
        collection={collection}
        initialAnnotations={initialAnnotations}
        initialAnnotationsMeta={initialAnnotationsMeta}
      />
    </>
  );
}
