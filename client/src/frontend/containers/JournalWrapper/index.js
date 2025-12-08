import { Outlet, useParams } from "react-router";
import { useFromStore } from "hooks";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export default function JournalWrapper() {
  const { id } = useParams();
  const journal = useFromStore({
    entityType: "journals",
    id,
    action: "grab"
  });

  if (!journal) return null;

  return (
    <>
      {journal && (
        <EventTracker event={EVENTS.VIEW_RESOURCE} resource={journal} />
      )}
      <Outlet
        context={{
          journal
        }}
      />
    </>
  );
}

JournalWrapper.displayName = "Frontend.Containers.JournalWrapper";
