import { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import { useDispatch } from "react-redux";
import ContentBlock from "backend/components/content-block";
import Hero from "backend/components/hero";
import OutletWithDrawer from "global/components/router/OutletWithDrawer";
import lh from "helpers/linkHandler";
import { projectsAPI, requests } from "api";
import { useFetch } from "hooks";
import Authorize from "hoc/Authorize";

export default function ProjectLayoutContainer() {
  const outletContext = useOutletContext() || {};
  const { project } = outletContext;
  const dispatch = useDispatch();

  const { data: actionCallouts, refresh: refreshActionCallouts } = useFetch({
    request: [projectsAPI.actionCallouts, project?.id],
    options: { requestKey: requests.beActionCallouts },
    condition: !!project?.id
  });

  const drawerCloseCallbackRef = useRef(null);
  const pendingBlockRef = useRef(null);

  const drawerProps = project
    ? {
        closeUrl: lh.link("backendProjectLayout", project.id),
        lockScroll: "always",
        wide: true,
        closeCallback: drawerCloseCallbackRef.current
      }
    : null;

  if (!project) return null;

  return (
    <Authorize
      entity={project}
      ability="update"
      failureNotification
      failureRedirect={lh.link("backendProjects")}
    >
      <Hero.Builder
        include={["projectDescription", "actionCallouts"]}
        dispatch={dispatch}
        actionCallouts={actionCallouts}
        refreshActionCallouts={refreshActionCallouts}
        model={project}
        withDarkMode={!project.attributes.isJournalIssue}
      />
      <ContentBlock.Builder project={project}>
        {(closeCallback, pendingBlock) => {
          drawerCloseCallbackRef.current = closeCallback;
          pendingBlockRef.current = pendingBlock;

          return (
            <OutletWithDrawer
              drawerProps={drawerProps}
              context={{
                pendingBlock,
                project,
                refreshActionCallouts,
                calloutable: project,
                closeRoute: "backendProjectLayout"
              }}
            />
          );
        }}
      </ContentBlock.Builder>
    </Authorize>
  );
}

ProjectLayoutContainer.displayName = "Project.Layout";
