import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import { resourcesAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import ResourceDetail from "frontend/components/resource/Detail";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import HeadContent from "global/components/HeadContent";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { getJournalBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import { useSettings } from "hooks";

export const loader = async ({ params, context }) => {
  const fetchFn = () => resourcesAPI.show(params.resourceId);
  return loadEntity({ context, fetchFn });
};

export default function ResourceDetailRoute({ loaderData: resource }) {
  const project = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const headContentProps = useEntityHeadContent(resource, project);

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;

  const projectCrumb = {
    to: `/projects/${project.attributes.slug}`,
    label: project.attributes.titlePlaintext
  };
  const resourcesCrumb = {
    to: `/projects/${project.attributes.slug}/resources`,
    label: t("glossary.resource_other")
  };
  const currentCrumb = {
    to: `/projects/${project.attributes.slug}/resource/${resource.attributes.slug}`,
    label: resource.attributes.titlePlaintext
  };

  const breadcrumbs = journalBreadcrumbs
    ? [...journalBreadcrumbs, resourcesCrumb, currentCrumb].filter(Boolean)
    : [projectCrumb, resourcesCrumb, currentCrumb].filter(Boolean);

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={resource} />
      <CheckFrontendMode debugLabel="ResourceDetail" isProjectSubpage />
      <HeadContent {...headContentProps} />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <ResourceDetail
        projectTitle={project.attributes.titlePlaintext}
        resource={resource}
      />
    </>
  );
}
