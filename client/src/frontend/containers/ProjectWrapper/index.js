import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom-v5-compat";
import { useTranslation } from "react-i18next";
import { useFetch, useFromStore, useRedirectToFirstMatch } from "hooks";
import { projectsAPI } from "api";
import { childRoutes } from "helpers/router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { getJournalBreadcrumbs } from "./helpers";

export default function ProjectWrapper({ route }) {
  const { id } = useParams();
  const { data: project, response } = useFetch({
    request: [projectsAPI.show, id]
  });
  const location = useLocation();
  const isHomePage = location.pathname === `/projects/${id}`;
  const settings = useFromStore({ requestKey: "settings", action: "select" });
  const libraryDisabled = settings?.attributes?.general?.libraryDisabled;

  useRedirectToFirstMatch({
    route: "frontendProject",
    candidates: [
      {
        label: "All Projects",
        route: "frontendProjectsAll"
      }
    ]
  });

  const { t } = useTranslation();

  const breadcrumbsCallback = useCallback(
    () => getJournalBreadcrumbs(project, t, libraryDisabled),
    [project, t, libraryDisabled]
  );

  const journalBreadcrumbs = project?.attributes?.isJournalIssue
    ? breadcrumbsCallback()
    : null;

  return (
    <>
      {project && (
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={project} />
      )}
      <CheckFrontendMode
        debugLabel="ProjectWrapper"
        project={project}
        isProjectHomePage={isHomePage}
      />
      {childRoutes(route, {
        childProps: {
          project,
          response,
          settings,
          journalBreadcrumbs
        }
      })}
    </>
  );
}

ProjectWrapper.displayName = "Frontend.Containers.ProjectWrapper";

ProjectWrapper.propTypes = {
  route: PropTypes.object
};
