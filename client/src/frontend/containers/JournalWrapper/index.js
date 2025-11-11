import { journalsAPI } from "api";
import { useParams, Outlet, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useFetch } from "hooks";
import CheckFrontendMode from "global/containers/CheckFrontendMode";
import EventTracker, { EVENTS } from "global/components/EventTracker";
import lh from "helpers/linkHandler";

export default function JournalWrapper() {
  const { id } = useParams();
  const { data: journal, response } = useFetch({
    request: [journalsAPI.show, id],
    condition: id !== "all"
  });
  const location = useLocation();
  const isHomePage = location.pathname === `/journals/${id}`;

  if (id === "all") return <Navigate to={lh.link("frontendJournalsList")} />;

  if (!journal) return null;

  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={journal} />
      <CheckFrontendMode
        debugLabel="JournalWrapper"
        project={journal}
        isProjectHomePage={isHomePage}
      />
      <Outlet
        context={{
          journal,
          response
        }}
      />
    </>
  );
}

JournalWrapper.displayName = "Frontend.Containers.JournalWrapper";
