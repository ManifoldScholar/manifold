import { useTranslation } from "react-i18next";
import { useOutletContext } from "react-router";
import ResourceDetail from "components/frontend/resource/Detail";
import { resourcesAPI } from "api";
import { RegisterBreadcrumbs } from "components/global/atomic/Breadcrumbs";
import HeadContent from "components/global/HeadContent";
import useEntityHeadContent from "components/frontend/entity/useEntityHeadContent";
import EventTracker, { EVENTS } from "components/global/EventTracker";
import loadEntity from "lib/react-router/loaders/loadEntity";
import { getJournalBreadcrumbs } from "helpers/breadcrumbs";
import { useSettings } from "hooks";

export const handle = { frontendMode: { isProjectSubpage: true } };

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

export const loader = async ({ params, request, context }) => {
  const { resourceId } = params;
  const fetchFn = () => resourcesAPI.show(resourceId);
  return loadEntity({ context, fetchFn, request });
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
      <HeadContent {...headContentProps} />
      <RegisterBreadcrumbs breadcrumbs={breadcrumbs} />
      <ResourceDetail
        projectTitle={project.attributes.titlePlaintext}
        resource={resource}
      />
    </>
  );
}
