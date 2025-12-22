import { redirect } from "react-router";
import { Outlet } from "react-router";
import { journalsAPI } from "api";
import loadEntity from "app/routes/utility/loaders/loadEntity";
import EventTracker, { EVENTS } from "global/components/EventTracker";

export const loader = async ({ params, context }) => {
  if (params.id === "all") {
    throw redirect("/journals");
  }

  const fetchFn = () => journalsAPI.show(params.id);
  return loadEntity({ context, fetchFn });
};

export default function JournalWrapperRoute({ loaderData: journal }) {
  return (
    <>
      <EventTracker event={EVENTS.VIEW_RESOURCE} resource={journal} />
      <Outlet context={journal} />
    </>
  );
}
