import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import ResourceDetail from "frontend/components/resource/Detail";
import { resourcesAPI } from "api";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import HeadContent from "global/components/HeadContent";
import useEntityHeadContent from "frontend/components/entity/useEntityHeadContent";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import { getJournalBreadcrumbs } from "app/routes/utility/helpers/breadcrumbs";
import { useSettings } from "hooks";

const getBreadcrumbs = ({
  journalBreadcrumbs,
  project,
  resource,
  collection,
  t
}) => {
  const projectCrumb = {
    to: `/projects/${project.attributes.slug}`,
    label: project.attributes.titlePlaintext
  };
  const resourcesCrumb = {
    to: `/projects/${project.attributes.slug}/resource-collections`,
    label: t("glossary.resource_collection_other")
  };
  const collectionCrumb = {
    to: `/projects/${project.attributes.slug}/resource-collection/${collection.attributes.slug}`,
    label: collection.attributes.title
  };
  const currentCrumb = {
    to: `/projects/${project.attributes.slug}/resource/${resource.attributes.slug}`,
    label: resource.attributes.titlePlaintext
  };

  return journalBreadcrumbs
    ? [...journalBreadcrumbs, resourcesCrumb, collectionCrumb, currentCrumb]
    : [projectCrumb, resourcesCrumb, collectionCrumb, currentCrumb];
};

export const loader = async ({ params, context }) => {
  const { resourceId } = params;
  const fetchFn = () => resourcesAPI.show(resourceId);
  return loadEntity({ context, fetchFn });
};

export default function ResourceDetailRoute({ loaderData: resource }) {
  const { project, collection } = useOutletContext();
  const { t } = useTranslation();
  const settings = useSettings();
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  const headContentProps = useEntityHeadContent(resource, project);

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? getJournalBreadcrumbs(project, t, libraryDisabled)
    : null;

  const breadcrumbs = getBreadcrumbs({
    journalBreadcrumbs,
    project,
    resource,
    collection,
    t
  });

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
