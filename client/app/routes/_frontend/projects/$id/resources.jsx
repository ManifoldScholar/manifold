import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { projectsAPI } from "api";
import checkLibraryMode from "lib/react-router/loaders/checkLibraryMode";
import loadList from "lib/react-router/loaders/loadList";
import createListClientLoader from "lib/react-router/loaders/createListClientLoader";
import { useListFilters, useListSearchParams, useSettings } from "hooks";
import HeadContent from "components/global/HeadContent";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import EntityCollection from "components/frontend/entity/Collection";
import { getJournalBreadcrumbs } from "helpers/breadcrumbs";

export const handle = { frontendMode: { isProjectSubpage: true } };

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  const fetchFn = (filters, pagination) =>
    projectsAPI.resources(params.id, filters, pagination);

  return loadList({
    request,
    context,
    fetchFn
  });
};

export const clientLoader = async ({ params, request, serverLoader }) => {
  const fetchFn = (filters, pagination) =>
    projectsAPI.resources(params.id, filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__projectResourcesHydrated",
    fetchFn
  });

  return clientLoaderFn({ request, serverLoader });
};

export default function ProjectResourcesRoute({ loaderData }) {
  const { data: resources, meta } = loaderData;
  const project = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { filters, setFilters } = useListSearchParams();

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

  const projectCrumb = {
    to: `/projects/${slug}`,
    label: titlePlaintext
  };
  const resourcesCrumb = {
    to: `/projects/${slug}/resources`,
    label: t("glossary.resource_other")
  };
  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;
  const breadcrumbs = journalBreadcrumbs
    ? [...journalBreadcrumbs, resourcesCrumb].filter(Boolean)
    : [projectCrumb, resourcesCrumb].filter(Boolean);

  const headContentProps = useEntityHeadContent(
    project,
    null,
    t("glossary.resource_title_case_other")
  );

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
