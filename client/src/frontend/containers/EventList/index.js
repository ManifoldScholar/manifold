import { useTranslation } from "react-i18next";
import { useParams, useOutletContext, Navigate } from "react-router-dom";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import { projectsAPI } from "api";
import lh from "helpers/linkHandler";
import { RegisterBreadcrumbs } from "global/components/atomic/Breadcrumbs";
import EntityCollection from "frontend/components/entity/Collection";
import HeadContent from "global/components/HeadContent";
import { useFetch, useListQueryParams } from "hooks";

export default function EventList() {
  const { project, journalBreadcrumbs } = useOutletContext() || {};
  const { id } = useParams();

  // API does not send meta for this list
  const { pagination } = useListQueryParams();
  const { data: events, meta } = useFetch({
    request: [projectsAPI.events, id, null, pagination]
  });
  const { t } = useTranslation();

  const { titlePlaintext, slug, hideActivity, description, avatarStyles } =
    project?.attributes ?? {};

  const projectCrumb = {
    to: lh.link("frontendProject", slug),
    label: titlePlaintext
  };
  const eventsCrumb = {
    to: lh.link("frontendProjectEvents", slug),
    label: t("glossary.event_other")
  };
  const breadcrumbs = journalBreadcrumbs
    ? [...journalBreadcrumbs, eventsCrumb].filter(Boolean)
    : [projectCrumb, eventsCrumb].filter(Boolean);

  if (!project || !events) return null;

  if (hideActivity) {
    const redirectUrl = lh.link(
      "frontendProjectDetail",
      project.attributes.slug
    );

    if (__SERVER__) {
      throw new Response(null, {
        status: 302,
        headers: { Location: redirectUrl }
      });
    }

    return <Navigate to={redirectUrl} replace />;
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

EventList.displayName = "Frontend.Containers.EventList";
