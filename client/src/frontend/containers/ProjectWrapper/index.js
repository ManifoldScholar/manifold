import { useCallback } from "react";
import PropTypes from "prop-types";
import {
  useLocation,
  useParams,
  useRouteMatch,
  Redirect
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useFetch, useFromStore, useRedirectToFirstMatch } from "hooks";
import { projectsAPI } from "api";
import { childRoutes } from "helpers/router";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import { getJournalBreadcrumbs } from "./helpers";
import lh from "helpers/linkHandler";

export default function ProjectWrapper({ route }) {
  const { id } = useParams();
  const { data: project, response } = useFetch({
    request: [projectsAPI.show, id],
    condition: id !== "all"
  });
  const { path } = useRouteMatch();
  const location = useLocation();
  const isHomePage = location.pathname === path;
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

  if (id === "all") return <Redirect to={lh.link("frontendProjectsAll")} />;

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
