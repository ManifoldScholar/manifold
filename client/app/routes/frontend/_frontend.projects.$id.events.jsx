import { Navigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { projectsAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useSettings } from "hooks";
import checkLibraryMode from "app/routes/utility/loaders/checkLibraryMode";
import loadList from "app/routes/utility/loaders/loadList";
import createListClientLoader from "app/routes/utility/loaders/createListClientLoader";
import { getJournalBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";

export const loader = async ({ params, request, context }) => {
  checkLibraryMode({ request, context });

  const fetchFn = (filters, pagination) =>
    projectsAPI.events(params.id, filters, pagination);

  return loadList({
    request,
    context,
    fetchFn
  });
};

export const clientLoader = async ({ params, request, serverLoader }) => {
  const fetchFn = (filters, pagination) =>
    projectsAPI.events(params.id, filters, pagination);

  const clientLoaderFn = createListClientLoader({
    hydrateKey: "__projectEventsHydrated",
    fetchFn
  });

  return clientLoaderFn({ request, serverLoader });
};

export default function EventListRoute({ loaderData }) {
  const { data: events, meta } = loaderData;
  const project = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const { titlePlaintext, slug, hideActivity, description, avatarStyles } =
    project?.attributes ?? {};

  const projectCrumb = {
    to: `/projects/${slug}`,
    label: titlePlaintext
  };
  const eventsCrumb = {
    to: `/projects/${slug}/events`,
    label: t("glossary.event_other")
  };
  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;
  const breadcrumbs = journalBreadcrumbs
    ? [...journalBreadcrumbs, eventsCrumb].filter(Boolean)
    : [projectCrumb, eventsCrumb].filter(Boolean);

  if (hideActivity) {
    return <Navigate to={`/projects/${project.attributes.slug}`} replace />;
  }

  return (
    <>
      <HeadContent
        title={`${titlePlaintext} | ${t("pages.events")}`}
        description={description}
        image={avatarStyles.mediumSquare}
        appendDefaultTitle
      />
      <CheckFrontendMode
        debugLabel="EventList"
        project={project}
        isProjectSubpage
      />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <EntityCollection.Events events={events} eventsMeta={meta} />
    </>
  );
}
